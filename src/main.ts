import { Command, Plugin } from 'obsidian';
import * as feather from "feather-icons";
import { addIcon } from "obsidian";
import CustomMenuSettingsTab, { CustomMenuSettings, DEFAULT_SETTINGS } from './ui/settingsTab';

export default class CustomMenuPlugin extends Plugin {
	settings: CustomMenuSettings;
	//native obsidian icon names, will add feather icons
	iconList: string[] = ["any-key", "audio-file", "blocks", "bold-glyph", "bracket-glyph", "broken-link", "bullet-list", "bullet-list-glyph", "calendar-with-checkmark", "check-in-circle", "check-small", "checkbox-glyph", "checkmark", "clock", "cloud", "code-glyph", "create-new", "cross", "cross-in-box", "crossed-star", "csv", "deleteColumn", "deleteRow", "dice", "document", "documents", "dot-network", "double-down-arrow-glyph", "double-up-arrow-glyph", "down-arrow-with-tail", "down-chevron-glyph", "enter", "exit-fullscreen", "expand-vertically", "filled-pin", "folder", "formula", "forward-arrow", "fullscreen", "gear", "go-to-file", "hashtag", "heading-glyph", "help", "highlight-glyph", "horizontal-split", "image-file", "image-glyph", "indent-glyph", "info", "insertColumn", "insertRow", "install", "italic-glyph", "keyboard-glyph", "languages", "left-arrow", "left-arrow-with-tail", "left-chevron-glyph", "lines-of-text", "link", "link-glyph", "logo-crystal", "magnifying-glass", "microphone", "microphone-filled", "minus-with-circle", "moveColumnLeft", "moveColumnRight", "moveRowDown", "moveRowUp", "note-glyph", "number-list-glyph", "open-vault", "pane-layout", "paper-plane", "paused", "pdf-file", "pencil", "percent-sign-glyph", "pin", "plus-with-circle", "popup-open", "presentation", "price-tag-glyph", "quote-glyph", "redo-glyph", "reset", "right-arrow", "right-arrow-with-tail", "right-chevron-glyph", "right-triangle", "run-command", "search", "sheets-in-box", "sortAsc", "sortDesc", "spreadsheet", "stacked-levels", "star", "star-list", "strikethrough-glyph", "switch", "sync", "sync-small", "tag-glyph", "three-horizontal-bars", "trash", "undo-glyph", "unindent-glyph", "up-and-down-arrows", "up-arrow-with-tail", "up-chevron-glyph", "uppercase-lowercase-a", "vault", "vertical-split", "vertical-three-dots", "wrench-screwdriver-glyph"];

	async onload() {
		console.log('Loading customizable menu...');

		await this.loadSettings();
		this.addSettingTab(new CustomMenuSettingsTab(this.app, this));

		this.addFeatherIcons();

		this.settings.menuCommands.forEach(command => {
			this.addMenuItem(command);
		});
	}

	onunload() {
		console.log('Unloading customizable menu');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	//add command to right-click menu (on open)
	addMenuItem(command: Command) {
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu) => {
				menu.addItem((item) => {
					item.setTitle(command.name)
					.setIcon(command.icon)
					.onClick(() => { 
						//@ts-ignore
						this.app.commands.executeCommandById(command.id);
					});
				});
			})
		);
	}

	//add the given command to right-click menu (persistent, saved in settings)
	async addMenuItemSetting(command: Command, settingTab: CustomMenuSettingsTab) {
		this.addMenuItem(command);
		this.settings.menuCommands.push(command);
		await this.saveSettings();
		
		settingTab.display(); //refresh settings tab
	}


	//add proprly formatted feather icons to list
	private addFeatherIcons() {
		Object.values(feather.icons).forEach((i) => {
			const svg = i.toSvg({viewBox: "0 0 24 24", width: "100", height: "100"});
			addIcon("feather-" + i.name, svg);
			this.iconList.push("feather-" + i.name);
		});
	}
}