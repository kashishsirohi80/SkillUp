document.querySelectorAll('.letters').forEach(letter => {
    // Store the original position and styles of each .letters element
    const originalStyle = {
        transform: letter.style.transform,
    };

    letter.addEventListener('mouseover', () => {
        // Find the closest ancestor with the class 'site'
        const ancestor = letter.closest('.site');

        if (ancestor) {
            // Calculate random positions within the ancestor container
            const randomX = Math.floor(Math.random() * (ancestor.clientWidth - letter.clientWidth));
            const randomY = Math.floor(Math.random() * (ancestor.clientHeight - letter.clientHeight));

            // Move the letter to a random position using transform
            letter.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }
    });

    letter.addEventListener('mouseout', () => {
        // Restore the original transform position with a smooth transition
        letter.style.transform = originalStyle.transform || 'translate(0, 0)';
    });
});