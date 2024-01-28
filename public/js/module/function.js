// Functions.js - Module containing reusable functions for the game


// Fonctionto update health bar
export function updateHealthBar(character, healthBar) {
     // Calculate the health percentage of the character
    let healthPercentage = character.health;

    // Update the health bar's width and text content based on the health percentage
    healthBar.style.width = healthPercentage + '%';
    healthBar.textContent = healthPercentage + ' HP';

     // Remove blinking effects
    healthBar.classList.remove('slow-blink', 'fast-blink');

      // Change the health bar's color based on the health percentage
    if (healthPercentage <= 30) {
        healthBar.style.backgroundColor = 'red';
        healthBar.style.color = 'white';
        healthBar.style.fontSize = "10px"
        healthBar.classList.add('fast-blink'); // Add fast blinking effect for low health
    } else if (healthPercentage <= 50) {
        healthBar.style.backgroundColor = 'orange';
        healthBar.style.color = 'white';
        healthBar.classList.add('slow-blink');
    } else {
        healthBar.style.backgroundColor = 'green';
    }

    if (character.health <= 0) {
        healthBar.classList.remove('slow-blink', 'fast-blink');
    }
}

// Function to animate characters
export function animateCharacters(playerSprite, enemySprite, callback, moveToMiddle) {

     // Determine the starting position for animation
    moveToMiddle = true

    let position;
    if (moveToMiddle) {
        position = 0; //if player has to move to the middle, start at zero
    } else {
        position = 350; // else, start at 350px
    }

    let maxposition = 350;

      // Determine the increment direction based on moveToMiddle
    let increment;
    if (moveToMiddle) {
        increment = 1; 
    } else {
        increment = -1; 
    }

    let stock = setInterval(deplacer, 10);


    function deplacer() { 
        // Check if the target position is reached and execute the callback
        if (moveToMiddle && position >= maxposition) {
            clearInterval(stock);
            if (callback) {
                callback()
            };
        } else if (!moveToMiddle && position <= 0) {
            clearInterval(stock);
            if (callback) {
                callback()
            };
        } else {
              // Update position and apply it to character sprites
            position += increment;
            playerSprite.style.left = position + 'px';
            enemySprite.style.right = position + 'px';
        }
    }
}

// Variable to see if an action is currently being displayed
let enAffiche = false;

// Function to display actions
export function displayAction(actionQueue, message) {
     // Add the new action message to the queue
    actionQueue.push(message);
     // If no action is currently being displayed, process the next action
    if (!enAffiche) {
        nextAction(actionQueue);
    }
}



// Function to process the next action in the queue
export function nextAction(actionQueue) {
    if (actionQueue && actionQueue.length > 0 ) {
        enAffiche = true;

         // Get the next message from the queue
        let message = actionQueue.shift();

         // Create and display the action message element
        let actionDisplay = document.createElement('div');
        actionDisplay.className = 'action-message';
        actionDisplay.textContent = message;
        document.body.appendChild(actionDisplay);

          // Remove the message after a delay and process the next action in the queue
        setTimeout(() => {
            actionDisplay.remove();
            enAffiche = false;
            if (actionQueue.length > 0) {
                nextAction(actionQueue);
            }
        }, 3000); // 3 seconds before the message disappears
    }
}
