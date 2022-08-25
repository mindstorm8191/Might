# Might

A dark Tower Defense game

With players facing the Darkness, this game will need to have a heavy horror aspect to it. The key to making horror work is the atmosphere; having real dangers around that can harm the player

Ethan is right; we need to keep this simple. Or at least, the game should start simple.

##### The story plan so far

1.  Beginner levels; players learn to play the game. This will be 5-10 levels; players will not be able to complete the last level without replaying previous ones at harder levels (thus engraining the need to replay early levels with harder settings to advance).
2.  Meet other wizards. The player will meet 3 other wizards along the way (maybe 1 at a time, or maybe all 3). The difficulty will ramp up, and players will start playing cooperatively with the other wizards; this will become necessary to pass levels.
3.  Get the bad guy's attention (we need a name for this, besides The Forgotten. Maybe just The Darkness?). This will start out by the bad guy merely noticing your existence (showing up as a dark presence). Later levels it will add influence to the battle; giving monsters bonuses, destroying towers and things. The bad guy's influence will continue growing.
4.  Get sucked into the darkness. Players will attempt to enter a fortress. Just before they win that battle, a hole will suck them all into a dark area. Lighting torches, they discover an active orb and have to start a fight without any lights around them (fortunately, towers emit some light). All battles after this will begin in darkness, requiring players to spread lights around to see what monsters are coming, and what other elements are in the area. Also, players will be unable to access any previous levels, having no way to return to where they were.
5.  More direct fights with the Darkness creature. Fights will get harder, using more negative battle elements. Players will enter a fortress (just entering will be a huge battle). There will be multiple seals that have to be broken before getting into the center of the fortress. There the player will have their first fight with the Darkness directly.
6.  The chase. The Darkness will start fleeing, and the player's group will follow. Fights will get harder, and the Darkness will become more desperate to escape. It will begin travling up a mountain, seeking something inside it.
7.  Does the Darkness manage to escape? Can the players destroy it? I don't know yet.
    Actually, I think it would be best to leave that up to mystery: nobody knows if it still exists or not. Leave players of the world wondering. It'll be hard to pull off, though...

##### Ideas worth trying out

-   Need more monster types.
    -   I was thinking of having an artillery type; they get only so close to your orb, then start lobbing projectiles at it, avoiding getting closer. They might even chose a safe place to stop, verses following the normal path to an orb
    -   Slicers verses punchers. This would imply that both would have a good use. Maybe we should have barricades that can be put up? Though that certainly doesn't vibe well with the classic tower defense strategy

##### Dark effects to use in game

-   Fading lighting, especially when waves begin
-   Dark lines creeping across the interface. This probably means that the whole interface will need to be contained in a canvas, for proper effects generation... I dunno
    -   Clicking on objects in 3D should still be simple enough. I think the hard part will be displaying numbers & such on a 3D mesh... will have to look into what is needed for that
-   (Borrow some concepts from Thaumcraft's Tainted lands)
-   Tiles that darken or change color, without anything to explain why
-   Creatures moving around, generally in the same direction, but not impacting the battle any
-   Plants dying or transforming into grotesque hostile organisms. Passive animals around can do the same
-   Unstable interface; framerate has interruptions, having tiny pauses as though the computer is lagging. Later, pauses are longer and more noticeable, where things will creep around during the pauses.

##### Effects that The Darkness can generate in a battle

-   Creature waves suddenly become more powerful
-   Specific creatures suddenly gain strength
-   Towers or walls become 'infected' and crumble
-   Spheres of influence cause towers / traps to fire weakly or not at all, for a time
-   Vein-like extensions creeping across the map, which can spawn new creatures on the map at its ends
-   Torches / other light sources that go dim or completely out
-   Time jumps accompanied with pausing and jitteriness. Monsters can suddenly jump to different places as though seconds of frames were lost. Monsters may even jump through barricades through this. Towers and defenses won't benefit from this; either that or their attacks will be reset. Any shots already mid-air will miss.

Generally, The Darkness does not play fair with the player

##### Light sources the user can place

-   All towers will generate some amount of light around them. This will be limited in range, always smaller than the gem's firing range. Towers will not be able to target creatures in the darkness.
-   Torches can be placed around the map, too. These are a little brighter than a tower's light, and also cheaper to place
-   Light orbs will light even larger areas, and be less prone to damage or dimming, but also more expensive
-   Spot lights will focus light in a direction, which the user can change the angle of. The light's length will be substantial, but not cover a very wide area. This can be used to peek into the dark areas of the map and see what's out there, and place new towers / lights away from pre-lit areas
-   The player's orb will also generate light, covering a decent amount around the orb. Of course, that's not too helpful, being so close to the orb
