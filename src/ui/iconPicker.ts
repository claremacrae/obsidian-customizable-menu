import { FuzzySuggestModal, Command, FuzzyMatch, setIcon } from "obsidian";
import CustomMenuPlugin from "src/main";


export default class IconPicker extends FuzzySuggestModal<string>{
	plugin: CustomMenuPlugin;
	command: Command;

	constructor(plugin: CustomMenuPlugin, command: Command) {
		super(plugin.app);
		this.plugin = plugin;
		this.command = command;
		this.setPlaceholder("Pick an Icon");
	}

	private cap(string: string): string {
		const words = string.split(" ");

		return words.map((word) => {
			return word[0].toUpperCase() + word.substring(1);
		}).join(" ");
	}

	getItems(): string[] {
		return this.plugin.iconList;
	}

	getItemText(item: string): string {
		return this.cap(item.replace("feather-", "").replace(/-/ig, " "));
	}

	renderSuggestion(item: FuzzyMatch<string>, el: HTMLElement): void {
		el.addClass("CS-icon-container");
		const div = createDiv({ cls: "CS-icon" });
		el.appendChild(div);
		setIcon(div, item.item);
		super.renderSuggestion(item, el);
	}

	async onChooseItem(item: string): Promise<void> {
		const command = {name: this.command.name, id: this.command.id, icon: item}
		this.plugin.addMenuItemSetting(command);
		
	}

}
