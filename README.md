# BX Factions for Foundry VTT

This module adds a new type of Journal page to the Foundry virtual tabletop.

## Usage
The Faction sheet, as you might be able to surmise from this module's name, was built with the Basic/Expert-compatible TTRPGs. There's nothing stopping you from using it with other systems, though!

The page is separated into two views: the reading view and the edit view. 

### Creating a faction with the Edit view
1. Open a Journal, or create a new one.
2. Click "Add Page", then select the "Faction" page type
3. After creating the Faction page, fill in the HTML fields in the edit view as best describes your faction
4. Adjust the party's level of fame or infamy with the range controls on the "Relationships" tab.
	* Fame increases the party's reaction modifier with the faction, while infamy decreases it.
	* This is a homebrew means of tracking party reputation for game mechanics purposes, inspired by the video game *Fallout: New Vegas*.
	* Fame and infamy should be adjusted with care; on a 2d6 roll, a 1 can really sway things, while a 3 can outright avoid the best/worst possible outcomes. 
5. Drag and drop Actors that are either notable NPCs or rank and file members into the respective lists on the "Membership" tab.
  * If you need to edit or delete an Actor that you added to a faction, you can right click the Actor to do so.
	* Note: dragging an actor to the Faction sheet does not copy the actor; it stores a reference to the actor that is then used to look up the actor later.

### Putting the faction to use with the Reading view
This view isn't terribly complex, and works similarly to a typical text-based journal page.

The biggest differences are the fame, infamy, and reaction modifier fields at the top of the page, and the membership section of the page. With the membership section, you can drag and drop faction members onto the stage as needed.

## Compatibility
This module was built with features only available starting in Foundry v11. It is usable with any system, as it does not read system data to do its work.