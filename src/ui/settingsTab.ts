import { PluginSettingTab, App, Setting, setIcon, Command, Notice } from "obsidian";
import CustomMenuPlugin from "src/main";
import CommandSuggester from "./commandSuggester";

export interface CustomMenuSettings {
    menuCommands: Command[];
    hiddenCommands: string[];
}

export const DEFAULT_SETTINGS: CustomMenuSettings = {
    menuCommands: [],
    hiddenCommands: [],
}

export default class CustomMenuSettingsTab extends PluginSettingTab {
    plugin: CustomMenuPlugin;

    constructor(app: App, plugin: CustomMenuPlugin) {
        super(app, plugin);
        this.plugin = plugin;
        addEventListener("CS-addedCommand", () => {
            this.display();
        });
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'Customizable Menu Settings' });

        new Setting(containerEl)
            .setName("Add Command to Menu")
            .setDesc("Add a new Command to the right-click menu")
            .addButton((bt) => {
                bt.setButtonText("Add Command")
                    .onClick(() => {
                        new CommandSuggester(this.plugin).open();
                    });
            });

        this.plugin.settings.menuCommands.forEach(c => {
            const iconDiv = createDiv({ cls: "CS-settings-icon" });
            setIcon(iconDiv, c.icon, 20);
            const setting = new Setting(containerEl)
                .setName(c.name)
                .addButton(bt => {
                    bt.setButtonText("Remove Command")
                        .onClick(async () => {
                            this.plugin.settings.menuCommands.remove(c);
                            await this.plugin.saveSettings();
                            this.display();
                            new Notice("You will need to restart Obsidian for the Command to dissapear.")
                        })
                });
            setting.nameEl.prepend(iconDiv);
            setting.nameEl.addClass("CS-flex");
        });
    }
}



