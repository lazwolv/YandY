import { gsap } from 'gsap';
import React, { useEffect, useRef } from 'react';

const AICharacter = () => {
    const characterRef = useRef();
    const positionRef = useRef({ x: 0, y: 0 });
    const directionRef = useRef(1);

    useEffect(() => {
        const character = characterRef.current;
        const container = character.parentElement;
        const containerRect = container.getBoundingClientRect();

        // Initial position
        positionRef.current = {
            x: Math.random() * (containerRect.width - 100),
            y: Math.random() * (containerRect.height - 100)
        };

        gsap.set(character, {
            x: positionRef.current.x,
            y: positionRef.current.y
        });

        // Wander animation
        const wander = () => {
            const newX = positionRef.current.x + (Math.random() * 200 - 100) * directionRef.current;
            const newY = positionRef.current.y + (Math.random() * 200 - 100) * directionRef.current;

            // Keep character within bounds
            positionRef.current.x = Math.max(0, Math.min(containerRect.width - 100, newX));
            positionRef.current.y = Math.max(0, Math.min(containerRect.height - 100, newY));

            // Randomly change direction
            if (Math.random() < 0.1) {
                directionRef.current *= -1;
            }

            gsap.to(character, {
                x: positionRef.current.x,
                y: positionRef.current.y,
                duration: Math.random() * 2 + 1,
                ease: "power1.inOut",
                onComplete: wander
            });

            // Update character direction based on movement
            character.style.transform = `scaleX(${directionRef.current})`;
        };

        wander();

        // Handle mouse interaction
        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Calculate distance to mouse
            const dx = mouseX - positionRef.current.x;
            const dy = mouseY - positionRef.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // If mouse is close, make character react
            if (distance < 200) {
                gsap.to(character, {
                    scale: 1.2,
                    duration: 0.3
                });
            } else {
                gsap.to(character, {
                    scale: 1,
                    duration: 0.3
                });
            }
        };

        container.addEventListener('mousemove', handleMouseMove);

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div
            ref={characterRef}
            style={{
                position: 'absolute',
                width: '100px',
                height: '100px',
                backgroundImage: 'url(/images/ai-character.png)', // You'll need to provide this image
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                willChange: 'transform'
            }}
        />
    );
};

export default AICharacter; 