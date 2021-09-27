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

        return this;
    }

    display(): void {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Customizable Menu Settings' });

        new Setting(containerEl)
            .setName("Add Command to Menu")
            .setDesc("Add a new command to the right-click menu")
            .addButton((button) => {
                button.setButtonText("Add Command")
                    .onClick(() => {
                        new CommandSuggester(this.plugin, this).open();
                    });
            });

        this.plugin.settings.menuCommands.forEach(command => {
            const iconDiv = createDiv({ cls: "CS-settings-icon" });
            setIcon(iconDiv, command.icon, 20);
            const setting = new Setting(containerEl)
                .setName(command.name)
                .addExtraButton(button => {
                    button.setIcon("trash")
                        .setTooltip("Remove command")
                        .onClick(async () => {
                            this.plugin.settings.menuCommands.remove(command);
                            await this.plugin.saveSettings();
                            this.display();
                            new Notice("You will need to restart Obsidian for the command to disappear.")
                        })
                });
            setting.nameEl.prepend(iconDiv);
            setting.nameEl.addClass("CS-flex");
        });
    }
}



