"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 1

    // DNA helix model
    const dnaGroup = new THREE.Group()
    scene.add(dnaGroup)

    const primaryColor = theme === "dark" ? 0x3b82f6 : 0x3b82f6 // Blue in both themes
    const secondaryColor = theme === "dark" ? 0x10b981 : 0x10b981 // Green in both themes

    const strandMaterial1 = new THREE.MeshBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: 0.9,
    })
    const strandMaterial2 = new THREE.MeshBasicMaterial({
      color: secondaryColor,
      transparent: true,
      opacity: 0.9,
    })

    const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32)
    const cylinderGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 16)

    const numPoints = 40
    const radius = 2
    const height = 6

    // Create the DNA strands
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 4
      const y = (i / numPoints) * height - height / 2

      // First strand
      const x1 = Math.cos(angle) * radius
      const z1 = Math.sin(angle) * radius

      const sphere1 = new THREE.Mesh(sphereGeometry, strandMaterial1)
      sphere1.position.set(x1, y, z1)
      dnaGroup.add(sphere1)

      // Second strand (opposite side)
      const x2 = Math.cos(angle + Math.PI) * radius
      const z2 = Math.sin(angle + Math.PI) * radius

      const sphere2 = new THREE.Mesh(sphereGeometry, strandMaterial2)
      sphere2.position.set(x2, y, z2)
      dnaGroup.add(sphere2)

      // Connect with "rungs" every few points
      if (i % 4 === 0 && i < numPoints - 1) {
        const connector = new THREE.Mesh(
          cylinderGeometry,
          new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.7,
          }),
        )

        // Position at midpoint
        connector.position.set((x1 + x2) / 2, y, (z1 + z2) / 2)

        // Rotate to connect the points
        connector.lookAt(x2, y, z2)
        connector.rotateZ(Math.PI / 2)

        // Scale to fit
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2))
        connector.scale.set(1, distance, 1)

        dnaGroup.add(connector)
      }
    }

    // Add some particles around the DNA
    const particlesGeometry = new THREE.BufferGeometry()
    const particleCount = 200
    const posArray = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Random position in a sphere around the DNA
      const angle = Math.random() * Math.PI * 2
      const radius = 2 + Math.random() * 3
      const height = (Math.random() - 0.5) * 8

      posArray[i] = Math.cos(angle) * radius
      posArray[i + 1] = height
      posArray[i + 2] = Math.sin(angle) * radius
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: primaryColor,
      transparent: true,
      opacity: 0.5,
    })

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    // Add a soft light to illuminate the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(primaryColor, 1)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      controls.update()

      // Rotate the DNA
      dnaGroup.rotation.y += 0.002

      // Animate particles
      particlesMesh.rotation.y += 0.001

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }

      // Dispose geometries and materials
      sphereGeometry.dispose()
      cylinderGeometry.dispose()
      particlesGeometry.dispose()
      strandMaterial1.dispose()
      strandMaterial2.dispose()
      particlesMaterial.dispose()
    }
  }, [theme])

  return <div ref={containerRef} className="w-full h-full" />
}

