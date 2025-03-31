from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image
import io
import h5py
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to ["http://localhost:3000"] for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "model.h5"


# Custom Conv2D layer that supports groups, activation, use_bias, and other parameters.
class CustomConv2D(tf.keras.layers.Layer):
    def __init__(self, filters, kernel_size, strides=(1, 1), padding='valid',
                 data_format=None, dilation_rate=(1, 1), groups=1, activation=None, use_bias=True,
                 kernel_initializer="glorot_uniform", bias_initializer="zeros",
                 kernel_regularizer=None, bias_regularizer=None, activity_regularizer=None,
                 kernel_constraint=None, bias_constraint=None, **kwargs):
        # Fix the layer name if it contains '/'
        if "name" in kwargs and "/" in kwargs["name"]:
            kwargs["name"] = kwargs["name"].replace("/", "_")
            
        self.filters = filters
        self.kernel_size = kernel_size
        self.strides = strides
        self.padding = padding
        self.data_format = data_format
        self.dilation_rate = dilation_rate
        self.groups = groups
        self.activation = tf.keras.activations.get(activation)
        self.use_bias = use_bias
        self.kernel_initializer = kernel_initializer
        self.bias_initializer = bias_initializer
        self.kernel_regularizer = kernel_regularizer
        self.bias_regularizer = bias_regularizer
        self.activity_regularizer = activity_regularizer
        self.kernel_constraint = kernel_constraint
        self.bias_constraint = bias_constraint
        super(CustomConv2D, self).__init__(**kwargs)
        self.conv = None
        self.conv_layers = None

    def build(self, input_shape):
        if self.groups == 1:
            self.conv = tf.keras.layers.Conv2D(
                filters=self.filters,
                kernel_size=self.kernel_size,
                strides=self.strides,
                padding=self.padding,
                data_format=self.data_format,
                dilation_rate=self.dilation_rate,
                activation=self.activation,
                use_bias=self.use_bias,
                kernel_initializer=self.kernel_initializer,
                bias_initializer=self.bias_initializer,
                kernel_regularizer=self.kernel_regularizer,
                bias_regularizer=self.bias_regularizer,
                activity_regularizer=self.activity_regularizer,
                kernel_constraint=self.kernel_constraint,
                bias_constraint=self.bias_constraint
            )
            self.conv.build(input_shape)
        else:
            if self.data_format is None or self.data_format == 'channels_last':
                input_channels = input_shape[-1]
            else:
                input_channels = input_shape[1]
            if input_channels % self.groups != 0:
                raise ValueError("Input channels must be divisible by groups")
            self.group_filters = self.filters // self.groups
            self.conv_layers = []
            for _ in range(self.groups):
                conv_layer = tf.keras.layers.Conv2D(
                    filters=self.group_filters,
                    kernel_size=self.kernel_size,
                    strides=self.strides,
                    padding=self.padding,
                    data_format=self.data_format,
                    dilation_rate=self.dilation_rate,
                    activation=None,  # activation will be applied after concatenation
                    use_bias=self.use_bias,
                    kernel_initializer=self.kernel_initializer,
                    bias_initializer=self.bias_initializer,
                    kernel_regularizer=self.kernel_regularizer,
                    bias_regularizer=self.bias_regularizer,
                    activity_regularizer=self.activity_regularizer,
                    kernel_constraint=self.kernel_constraint,
                    bias_constraint=self.bias_constraint
                )
                if self.data_format is None or self.data_format == 'channels_last':
                    group_input_shape = list(input_shape)
                    group_input_shape[-1] = input_channels // self.groups
                else:
                    group_input_shape = list(input_shape)
                    group_input_shape[1] = input_channels // self.groups
                conv_layer.build(tuple(group_input_shape))
                self.conv_layers.append(conv_layer)
        super(CustomConv2D, self).build(input_shape)

    def call(self, inputs):
        if self.groups == 1:
            return self.conv(inputs)
        else:
            if self.data_format is None or self.data_format == 'channels_last':
                splits = tf.split(inputs, num_or_size_splits=self.groups, axis=-1)
            else:
                splits = tf.split(inputs, num_or_size_splits=self.groups, axis=1)
            outputs = [conv(s) for conv, s in zip(self.conv_layers, splits)]
            concatenated = tf.concat(outputs, axis=-1 if (self.data_format is None or self.data_format == 'channels_last') else 1)
            if self.activation is not None:
                return self.activation(concatenated)
            return concatenated

    def get_config(self):
        config = super(CustomConv2D, self).get_config()
        config.update({
            "filters": self.filters,
            "kernel_size": self.kernel_size,
            "strides": self.strides,
            "padding": self.padding,
            "data_format": self.data_format,
            "dilation_rate": self.dilation_rate,
            "groups": self.groups,
            "activation": tf.keras.activations.serialize(self.activation),
            "use_bias": self.use_bias,
            "kernel_initializer": self.kernel_initializer,
            "bias_initializer": self.bias_initializer,
            "kernel_regularizer": self.kernel_regularizer,
            "bias_regularizer": self.bias_regularizer,
            "activity_regularizer": self.activity_regularizer,
            "kernel_constraint": self.kernel_constraint,
            "bias_constraint": self.bias_constraint,
        })
        return config

# Custom BatchNormalization that fixes layer names containing '/'
class CustomBatchNormalization(tf.keras.layers.BatchNormalization):
    def __init__(self, **kwargs):
        if "name" in kwargs and "/" in kwargs["name"]:
            kwargs["name"] = kwargs["name"].replace("/", "_")
        super(CustomBatchNormalization, self).__init__(**kwargs)

# Custom Activation layer that fixes layer names containing '/'
class CustomActivation(tf.keras.layers.Activation):
    def __init__(self, activation, **kwargs):
        if "name" in kwargs and "/" in kwargs["name"]:
            kwargs["name"] = kwargs["name"].replace("/", "_")
        super(CustomActivation, self).__init__(activation, **kwargs)

def load_model_with_custom_names():
    """Load model with custom layer name fixing and custom object mapping for 'Functional', Conv2D, BatchNormalization, and Activation."""
    def fix_layer_names(name):
        return name.replace('/', '_')
    
    # Create a temporary HDF5 file with fixed dataset names.
    with h5py.File(MODEL_PATH, 'r') as h5file:
        temp_path = MODEL_PATH + '.temp.h5'
        with h5py.File(temp_path, 'w') as temp_file:
            for attr_name, attr_value in h5file.attrs.items():
                temp_file.attrs[attr_name] = attr_value
            def copy_group(name, obj):
                if isinstance(obj, h5py.Dataset):
                    fixed_name = fix_layer_names(name)
                    temp_file.create_dataset(fixed_name, data=obj[()])
                    for attr_name, attr_value in obj.attrs.items():
                        temp_file[fixed_name].attrs[attr_name] = attr_value
            h5file.visititems(copy_group)
        try:
            custom_objects = {
                "Functional": tf.keras.models.Model,
                "Conv2D": CustomConv2D,
                "BatchNormalization": CustomBatchNormalization,
                "Activation": CustomActivation,
            }
            model = load_model(temp_path, custom_objects=custom_objects)
            print("✅ Model loaded successfully!")
            return model
        except Exception as e:
            print(f"❌ Error loading fixed model: {e}")
            raise e
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

try:
    model = load_model_with_custom_names()
except Exception as e:
    print("Trying alternative loading method...")
    try:
        custom_objects = {
            "Functional": tf.keras.models.Model,
            "Conv2D": CustomConv2D,
            "BatchNormalization": CustomBatchNormalization,
            "Activation": CustomActivation,
        }
        model = load_model(MODEL_PATH, custom_objects=custom_objects)
        print("✅ Model loaded successfully with custom objects!")
    except Exception as e:
        print(f"❌ Error loading model with all methods: {e}")
        raise e

def preprocess_image(image: Image.Image):
    """Convert image to a format compatible with the model."""
    image = image.convert("RGB")
    image = image.resize((224, 224))
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

class_names = ['Cardiomegaly', 'Emphysema', 'Effusion', 'Hernia', 'Infiltration', 
               'Mass', 'Nodule', 'Atelectasis', 'Pneumothorax', 'Pleural_Thickening', 
               'Pneumonia', 'Fibrosis', 'Edema', 'Consolidation']

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        # Read and preprocess the uploaded image
        image = Image.open(io.BytesIO(await file.read()))
        processed_image = preprocess_image(image)

        # Perform prediction using the model
        prediction = model.predict(processed_image)
        predicted_index = int(np.argmax(prediction, axis=1)[0])
        confidence = float(np.max(prediction))
        predicted_class_name = class_names[predicted_index]

        # Return results in a format compatible with the frontend
        return {
            "condition": predicted_class_name,
            "confidence": round(confidence * 100, 2),  # Convert confidence to percentage
            "additional_info": f"The AI detected {predicted_class_name} with {round(confidence * 100, 2)}% confidence."
        }
    
    except Exception as e:
        print(f"Prediction error: {e}")  # Log error for debugging
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))  # Default to 8000 if PORT is not set
    uvicorn.run("main:app", host="0.0.0.0", port=port)
