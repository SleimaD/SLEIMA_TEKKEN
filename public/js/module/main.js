// Main script of the game

// Importing required functions from other modules
import { charactersData, setPlayerCharacter, setEnemyCharacter, getPlayerCharacter, getEnemyCharacter } from './instance.js';
import { updateHealthBar, animateCharacters, displayAction } from './function.js';


// Event listener  to ensure the DOM is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {

     // Get DOM elements
    let welcomeScreen = document.getElementById('welcome-screen');
    let selectionScreen = document.getElementById('selection-screen');
    let battleScreen = document.getElementById('battle-screen');
    let startFightButton = document.getElementById('start-fight');
    let playerSprite = document.getElementById('player-sprite');
    let enemySprite = document.getElementById('enemy-sprite');
    let playerHealthBar = document.getElementById('player-health-bar');
    let enemyHealthBar = document.getElementById('enemy-health-bar');


    // Initialize an action queue for storing game actions
    let actionQueue = []

    // Event listener for the start game button
    document.getElementById('start-game').addEventListener('click', function() {
         // Hide the welcome screen and show the character selection screen
        welcomeScreen.style.display = 'none';
        selectionScreen.style.display = 'block';
    });

    
      // Character selection logic
    document.querySelectorAll('.character').forEach(characterElement => {
        characterElement.addEventListener('click', function() {

            // Get the selected character's name and find the character data
            let characterName = this.dataset.name;
            let selectedCharacter = charactersData.find(c => c.name === characterName);


              // Set the selected player character
            setPlayerCharacter(selectedCharacter);

             // Update the sprites for player and enemy characters
            updateSprite(getPlayerCharacter(), playerSprite, enemySprite);

             // Update UI to reflect character selection
            document.querySelectorAll('.character').forEach(el => el.classList.remove('character-selected'));
            this.classList.add('character-selected');
            startFightButton.disabled = false;
            startFightButton.style.opacity = "1";
        });
    });

    // Event listener for starting the fight
    startFightButton.addEventListener('click', function() {

        // Select a random enemy, ensuring it's not the same as the player character
        let randomEnemy;
        do {
            randomEnemy = charactersData[Math.floor(Math.random() * charactersData.length)];
        } while (randomEnemy.name === getPlayerCharacter().name);

        // Set the enemy character
        setEnemyCharacter(randomEnemy);


         // Change display to show the battle screen
        selectionScreen.style.display = 'none';
        battleScreen.style.display = 'block';

        // initialize fight
        initiateCombat();

        // Animate characters for the beginning of the battle
        animateCharacters(playerSprite, enemySprite, startAttackPhase);
    });


     // Function to initialize combat
    function initiateCombat() {

         // Get the container for attack buttons and clear it
        let attackButtonsContainer = document.getElementById('attack-buttons');
        attackButtonsContainer.innerHTML = ''; 
        

        // Create attack buttons based on the player character's attacks
        getPlayerCharacter().attacks.forEach(attack => {
            let button = document.createElement('button');
            button.innerText = attack;
            
            button.addEventListener('click', () => {

                   // Animate characters towards the middle for the attack
                animateCharacters(playerSprite, enemySprite, () => {
                     // Perform the attack and then animate characters back to initial position
                    performAttack(attack, () => {

                        animateCharacters(playerSprite, enemySprite, () => {
                           // Reset state for the next round or handle end of combat
                        }, false);
                    });
                }, true);
            });
            attackButtonsContainer.appendChild(button);
        });
                
        // Reset state for the next round or handle end of combat
        updateHealthBar(getPlayerCharacter(), playerHealthBar);
        updateHealthBar(getEnemyCharacter(), enemyHealthBar);
         // Start the attack phase
        animateCharacters(playerSprite, enemySprite, startAttackPhase);
    }

    // Function to start the attack phase
    function startAttackPhase() {
        performAttack(getPlayerCharacter().attacks[0]);
    }


     // Function to handle the end of combat
    function endCombat(winner) {
         // Display a message indicating the end of the game
        alert(winner + ' wins the battle!');
    
        //  Disable all attack buttons
        let attackButtons = document.querySelectorAll('#attack-buttons button');
        attackButtons.forEach(button => {
            button.disabled = true;
        });
    
        // Hide the combat screen and show the end or restart screen
        battleScreen.style.display = 'none';
      
    
        // reset the game
        resetGame();
    }
    
    

    function performAttack(attack) {
        playerSprite.classList.add('attacking');
    
        // calcul damages
        let playerDamage = calculateDamage(attack);
        getEnemyCharacter().health -= playerDamage;
        updateHealthBar(getEnemyCharacter(), enemyHealthBar);
        displayAction(actionQueue, `le player attaque avec ${attack} et inflige ${playerDamage} points de dégats`);
    
        // Vérify if enemy looses
        if (getEnemyCharacter().health <= 0) {
            endCombat("Player Wins");
            return;
        }
    
        // enemy's turn
        setTimeout(() => {
            // Remove attacking animation from player and add it to enemy
            playerSprite.classList.remove('attacking');
            enemySprite.classList.add('attacking');
    
            // Enemy chooses an attack and applies damage to player
            let enemyAttack = chooseEnemyAttack();
            let enemyDamage = calculateDamage(enemyAttack);
            getPlayerCharacter().health -= enemyDamage;

              // Update player's health bar
            updateHealthBar(getPlayerCharacter(), playerHealthBar);
            // Display enemy's action in the action queue
            displayAction(actionQueue, `l'ennemi attaque avec ${enemyAttack} et inflige ${enemyDamage} points de dégats.`);
    
            // Remove attacking animation from enemy
            enemySprite.classList.remove('attacking');
    
            // check if the player is defeated
            if (getPlayerCharacter().health <= 0) {
                endCombat("Enemy Wins");
            }
        }, 1000); // Delay before the enemy's response
    }
    

    
    
    // Function to calculate damage based on the attack type
    function calculateDamage(attackType) {
        // Simplified example of damage calculation
        switch (attackType) {
            case 'Kick':
                return 10;
            case 'Punch':
                return 12;
            case 'Block':
                return 0; 
            case 'Special':
                return 20;
            default:
                return 5;
        }
    }
    

    // Function to choose a random attack for the enemy
    function chooseEnemyAttack() {
       
        let enemyAttacks = getEnemyCharacter().attacks;
        let randomIndex = Math.floor(Math.random() * enemyAttacks.length);

         // Return a random attack from enemy's attacks
        return enemyAttacks[randomIndex];
    }
    
     // Function to reset the game
    function resetGame() {
         // Reset characters and health bars
        setPlayerCharacter(null);
        setEnemyCharacter(null);
    
        // Reset health bar
        playerHealthBar.style.width = '100%';
        enemyHealthBar.style.width = '100%';
    
        // Reset user interface
        let attackButtonsContainer = document.getElementById('attack-buttons');
        attackButtonsContainer.innerHTML = '';
        // Disable the start fight button and change its opacity
        startFightButton.disabled = true;
        startFightButton.style.opacity = "0.5";
    
        // Display the selection screen again
        welcomeScreen.style.display = 'block';
        selectionScreen.style.display = 'none';
        battleScreen.style.display = 'none';
    }
    
     // Function to update the sprites based on the selected character
    function updateSprite(character, playerSprite, enemySprite) {
         // Set the player sprite source
        playerSprite.src = character.spriteRight;
           // Find and set the enemy sprite source
        enemySprite.src = charactersData.find(c => c.name !== character.name).spriteLeft;
    }
});
