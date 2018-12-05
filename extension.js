const St = imports.gi.St;
const Main = imports.ui.main;

let box, iconBox;

function enable() {
    /* hide old tray */
    _tray().hide();

    /* container for new layout */
    box = new St.BoxLayout({
        style_class : 'legacy-tray-box'
    });

    /* replace icon box with placeholder */
    iconBox = _setIconBox(new St.BoxLayout({
        style_class : 'legacy-tray-icon-box'
    }));

    /* add UI elements */
    box.add_child(iconBox);
    Main.uiGroup.add_actor(box);
}

function disable() {
    /* remove UI elements */
    Main.uiGroup.remove_actor(box);
    box.remove_child(iconBox);

    /* replace placeholder with icon box */
    _setIconBox(iconBox);

    /* show old tray */
    _tray().show();

    /* clean up */
    box = null;
    iconBox = null;
}

/**
 * @returns the UI tray object
 */
function _tray() {
    return Main.legacyTray.actor.get_first_child();
}

/**
 * Replaces the icon box in the tray with the given one.
 * 
 * @param newIconBox - the icon box to set
 * @returns the icon box previously in place
 */
function _setIconBox(newIconBox) {
    let container = _tray().get_first_child();
    let oldIconBox = container.get_child_at_index(1);
    container.replace_child(oldIconBox, newIconBox);
    return oldIconBox;
}
