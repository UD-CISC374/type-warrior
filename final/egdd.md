# Type Warriors: Unleashed

## Elevator Pitch

You are a warrior in a dangerous world with enemies abound. You will use your typing knowledge to survive each enemy wave of attacks and deliver a multitude of attacks and defenses to your enemies to emerge victorious or perish along the way.

## Influences (Brief)

- Typing of the Dead
  - Medium: Game
  - Explanation: Typing of the Dead uses typing in words to attack enemies. This game also uses the concept of typing to control the game and interact with enemies in different ways.
- For Honor
  - Medium: Game
  - Explanation: In For Honor, attack and block directions are very important. You need to match the direction of the opponents attack in order to successfully block said attack. This is the basis of the idea of being able to react to an enemies attack with the correct directional block.
- Final Fantasy
  - Medium: Game
  - Explanation: Final Fantasy has a medieval, fantasy style to the game and allows you to use money you get from defeating enemies to purchase equipment and spells. In our game, you are a medieval warrior who is able to collect money for equipment and spells by defeating enemies.

## Core Gameplay Mechanics (Brief)

- Move around the battlefield by using the arrow keys
- Perform various attacks and defences with typing commands such as "attack right", "cast fireball", "block"
- A mistype causes the type input to reset, the screen glows red for a second and the user must retry their input.
- Being able to time the enemies attack is important as the block command only lasts seconds.
- Defeating an enemy gives you gold. Gold can be used to buy equipment,spells, and upgrades at the shop.

# Learning Aspects

## Learning Domains

Typing speed and accuracy

## Target Audiences

Our taget audience would be anyone who wants to improve their typing skills, ranging from k-12 students to adults who haven't really developed their typing skills. The mild violence would probably not make it recommended for younger kids.

## Target Contexts

- This would be a good assignment for typing classes as a homework assignment or possibly classwork assignment.

## Learning Objectives

*Remember, Learning Objectives are NOT simply topics. They are statements of observable behavior that a learner can do after the learning experience. You cannot observe someone "understanding" or "knowing" something.*

- By the end of the lesson, players will be able to maximize their WPM(Words Per Minute) when typing.
- By the end of the lesson, players will be able to create documents of text rapidly and accurately when typing.

## Prerequisite Knowledge

*What do they need to know prior to trying this game?*

- Prior to the game, players need to have basic knowledge of the keyboard keys layout.
- Prior to the game, players need to be able to spell simple words such as "move", "attack", "cast", etc.


## Assessment Measures

A pre-test that assesses the current speed and accuracy of the learners typing, followed by a post-test to measure improvements of the learner.
- You could use existing tools such as typingtest.com to assess the learners typing skills pre and post gameplay.

# What sets this project apart?

- Most, if not all, games out there that try to teach typing skills involve typing some word that appears on the screen to perform attacks, wheras our game has the player typing in commands to perform actions relevant to those commands. 
- The gameplay mechanics are more naturally interconnected with the learning mechanics because you are not simply typing random words that appear on the screen that are irrelevent to what you are doing, the words are relavent to what is going on in the actual game.

# Player Interaction Patterns and Modes

## Player Interaction Pattern

This is a game primarily for one person, although there might be an optional pvp mode where you can fight another player. The player types in different commands to interact with the worldspace and the other actors in said worldspace.

## Player Modes

- Single-player: You battle progressively harder enemies where the player has lower reaction timers the more enemies you beat. You can upgrade your equipment and abilities at the shop with gold earned by defeating enemies.


# Gameplay Objectives

- Defeat Enemies
    - Description: properly type in commands to attack, move, and defend to decrease the enemies hp to 0 and keep your hp as high as possible.
    - Alignment: this in turn leads to an ability to type faster and more accurately as you continuously type in commands to accomplish this objective.
- React Accordingly to enemy movements
    - Description: react before the timer runs out to enemy actions displayed on the screen.
    - Alignment: The timer and need to interpret what to do in each situation combined with having to also type out the command you want to use creates a need to be able to type faster in order to properly defend yourself and successfully attack the enemy.

# Procedures/Actions

The game constantly listens for keyboard input from the player. The player types in the commands they want to perform, and if they type in a character in the command that doesn't match any of the possible commands the game stops them, indicates the character they typed in that was wrong, and allows them to restart their command immediately.

When not in combat with an enemy you can either type fight onward! to continue to a new enemy/enemies or enter the shop with the shop command to open up the shop menu where you can click what upgrades you want. If you have enough gold the action gives you the upgrade, otherwise it tells you that you don't have enough gold.

# Rules

- If the player mistypes a character in a command they are entering, the game flashes red for a few seconds while ressetting the players current input.
- If the player types in a complete correct command, or hits enter to submit the command and it is a valid command, the proper action is performed.
- over time, enemies become harder. This means the following
  - the enemy has more health
  - the enemy does more damage
  - the player has less time to react to enemy actions
  - enemies will use better equipment and abilities
- better skills and weapons require more typing. e.g. if the player gets a steel sword, "swing right hand" would not use the sword to attack. instead the player has to type "swing steel sword right hand"

# Objects/Entities

- Player character that has hp, defense, strength, mana points, an inventory, and ability/spell list
- Shop that is stocked with a list of upgrades the player can buy
- Upgrades that are in the shops that have a price, various stat boosts, commands associated with them
- enemies that have hp, defense, strength, mana points, inventory, and ability/spell list

## Core Gameplay Mechanics (Detailed)

- Type based movements:
       The player may only use the arrow keys for movement. If the player wants to attack they
       have to type it out. Everything that the player does, other than movement, has to be typed out.
- Purchasing Equipment: 
        Over time the player will accumulate coins, coins can be used to purchase better equipment, whether it is a weapon,
        armor, or spells.
    
## Feedback

Progress is shown through visually showing the player when something is mistyped by making the screen glow red. 
It is also shown by showing the player that they typed the correct command by the player doing what the player typed.

We will keep a player stat that shows how fast the player can type based off of WPM, The player can see progress in the long term learning objective by seeing their words per minute increase over time.

# Story and Gameplay

## Presentation of Rules
-There will be a short tutorial where the player can test moving around using the simple moves that are given.
-The game will allow the player to learn of the penalties that happen when you mistype commands
## Presentation of Content
The material being taught is the game itself, just by playing the game the player has practice typing and become better typers. The words gradually get longer so the player gets more intesive learning the more they play.

## Story (Brief)

A player is sent out on a quest, along the way they have to defeat enemies and become stronger. The enemies become stronger the closer the player gets to the goal the harder the enemies get and the better the player needs to be. There are various ways the player can fight whether it is spells, swords, or just their bodies.

## Storyboarding

*Go into as much detail as needs be to visually convey the Dynamics of your game. Be detailed. Create storyboards and freeze frame images that concisely capture important key elements of your game. You are strongly recommended to sketch pictures on paper and embed them here. Be sure make it clear how previously-described mechanics come through in the dynamics.*

# Assets Needed

## Aethestics
The goal of the game is to be somewhat challenging so that the player is actually engaged and focused on the game. There will be music that will be somewhat intense in order to motivate the player. The graphics will most likely vary but will more or less gradually go from bright and lighthearted in the beginning, to darker and more intense as the game progresses.

## Graphical

- Characters List
  - Player/Fighter: choose from different sprites presented as options when a new game is started.
  - Enemy: randomly selects enemy sprites from a list of different classic fantasy enemy sprites.
- Textures:
  - Spell textures
  - Attack textures
  - Damage textures (display when you or the enemy is hit over the sprite of who is hit)
- Environment Art/Textures:
  - shop background: a background with shop aspects to it. Like a shopkeeper, a register, some items on display
  - Combat location to fight enemies
    -desert

## Audio


*Game region/phase/time are ways of designating a particularly important place in the game.*

- Music List (Ambient Sound)
  - Shop Music: Elevator type music similar to the shop music in games like final fantasy and the legend of zelda
  - Battle Music: Something similar to any of the battle music in final fantasy
  
- Sound List (SFX)
  - block sound
  - magic sound
  - typing mistake sound
  - shop purchase sound


# Metadata

* Template created by Austin Cory Bart <acbart@udel.edu>, Mark Sheriff, Alec Markarian, and Benjamin Stanley.
* Version 0.0.3
