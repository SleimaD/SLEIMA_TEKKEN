// Instances.js -instances for characters

//  characters data
export let charactersData = [
    {
        name: 'Marshall Law',
        spriteLeft: './public/src/marshallSprite.png',
        spriteRight: './public/src/marshallflipped.png',
        health: 100,
        attacks: ['Kick', 'Punch', 'Block', 'Special']
    },
    {
        name: 'Kazuya Mishima',
        spriteLeft: './public/src/kazuyaflipped.png',
        spriteRight: './public/src/kazuyaSprite.png',
        health: 100,
        attacks: ['Strike', 'Uppercut', 'Dodge', 'Special']
    }
    // Ajoutez d'autres personnages ici si nécessaire
];

// Instances of selected players
export let playerCharacter = null;
export let enemyCharacter = null;



// Function to set the player's character
export function setPlayerCharacter(character) {
    playerCharacter = character;
}

// Function to set the enemy's character
export function setEnemyCharacter(character) {
    enemyCharacter = character;
}


// Function to get the player's character
export function getPlayerCharacter() {
    return playerCharacter;
}

// Function to get the enemy's character
export function getEnemyCharacter() {
    return enemyCharacter;
}

