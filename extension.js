const Lang = imports.lang;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;

/**
 * Menu item dealing with legacy tray.
 */
var LegacyTrayPopupMenuItem = new Lang.Class({
    Name : 'LegacyTrayPopupMenuItem',
    Extends : PopupMenu.PopupBaseMenuItem,

    _init : function(iconBox, params) {
        this.parent(params);
        this.iconBox = iconBox;
        this.actor.add_child(iconBox);
    },

    removeIconBox : function() {
        this.actor.remove_child(this.iconBox);
    }
});

/**
 * Panel button with a menu to hold legacy tray.
 */
var LegacyTrayButton = new Lang.Class({
    Name : 'LegacyTrayButton',
    Extends : PanelMenu.Button,

    _init : function(iconBox) {
        this.parent(0.0, "Legacy Tray", false);

        /* button icon */
        let icon = new St.Icon({
            icon_name : 'system-run-symbolic',
            style_class : 'system-status-icon'
        });
        this.actor.add_child(icon);

        /* menu item with legacy tray inside */
        this.legacyTrayItem = new LegacyTrayPopupMenuItem(iconBox);

        this.menu.addMenuItem(this.legacyTrayItem);
    }
});

let button;

function enable() {
    /* remove legacy tray from main UI */
    let widget = Main.legacyTray.actor;
    Main.uiGroup.remove_child(widget);

    /* disassemble widget */
    _disassemleWidget();

    /* status panel button with legacy tray */
    button = new LegacyTrayButton(widget);

    // TODO: remove this, just to debug
    Main.legacyTrayButton = button;

    /* connects the menu with others in the panel */
    /* (keyboard navigation, focus, etc) */
    Main.panel.menuManager.addMenu(button.menu)

    /* add status panel button to main UI */
    Main.panel._rightBox.insert_child_at_index(button.container, 0);
}

function disable() {
    /* remove legacy tray from menu */
    button.lagacyTrayItem.removeIconBox();

    /* reassemble widget */
    _reassemleWidget();

    /* remove menu from manager */
    Main.panel.menuManager.removeMenu(button.menu);

    /* remove status panel button from UI */
    Main.panel._rightBox.remove_child(button.container);

    /* memory freak */
    button = null;
}

/**
 * Move icon-box out of slider, so it can be moved around.
 */
function _disassemleWidget() {
    _moveChild(
            Main.legacyTray._iconBox,
            Main.legacyTray._box,
            Main.legacyTray.actor);
}

/**
 * Move icon-box back into slider.
 */
function _reassemleWidget() {
    _moveChild(
            Main.legacyTray._iconBox,
            Main.legacyTray.actor,
            Main.legacyTray._box);
}

/**
 * Removes the child from an actor and add it to another.
 */
function _moveChild(child, from, to) {
    from.remove_child(child);
    to.add_child(child);
}

function _logCalls(target, id) {
    for ( let p in target) {
        if (typeof target[p] === 'function') {
            let name = p;
            _intercept(target, name, function(proceed) {
                log('[' + id + '] called function: ' + name);
                return proceed();
            });
        }
    }
}

function _intercept(target, name, handler) {
    let origin = target[name];
    target[name] = function() {
        let _arguments = arguments;
        let proceed = function() {
            return origin.apply(target, _arguments);
        }
        return handler.call(this, proceed, arguments);
    }
    return origin;
}

function _logProps(obj) {
    for ( let p in obj) {
        log('props of [' + obj + ']: ' + p);
    }
}
