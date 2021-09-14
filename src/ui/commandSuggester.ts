import { FuzzySuggestModal, Command } from "obsidian";
import CustomMenuPlugin from "src/main";
import IconPicker from "./iconPicker";

export default class CommandSuggester extends FuzzySuggestModal<Command> {

	constructor(private plugin: CustomMenuPlugin) {
		super(plugin.app);
	}

	getItems(): Command[] {
		//@ts-ignore
		return this.app.commands.listCommands();
	}

	getItemText(item: Command): string {
		return item.name;
	}

	async onChooseItem(item: Command, evt: MouseEvent | KeyboardEvent): Promise<void> {
		if (item.icon) {
			this.plugin.addMenuItem(item);
			this.plugin.settings.menuCommands.push(item);
			await this.plugin.saveSettings();
			
			setTimeout(() => {
				dispatchEvent(new Event("CS-addedCommand"));
			}, 100);
		} else {
			new IconPicker(this.plugin, item).open()
		}
	}

}