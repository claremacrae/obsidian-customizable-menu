import { PluginSettingTab, App, Setting, setIcon, Command, Notice } from "obsidian";
import CustomMenuPlugin from "src/main";
import CommandSuggester from "./commandSuggester";
import IconPicker from "./iconPicker";


export interface CustomMenuSettings {
    menuCommands: Command[];
}

export const DEFAULT_SETTINGS: CustomMenuSettings = {
    menuCommands: [],
}


export default class CustomMenuSettingsTab extends PluginSettingTab {
    plugin: CustomMenuPlugin;

    constructor(app: App, plugin: CustomMenuPlugin) {
        super(app, plugin);
        this.plugin = plugin;
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
            const iconDiv = createDiv({ cls: "custom-menu-settings-icon" });
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
                })
                .addExtraButton(button => {
                    button.setIcon("gear")
                        .setTooltip("Edit icon")
                        .onClick(() => {
                            new IconPicker(new CommandSuggester(this.plugin, this), command, true).open(); //rewrite icon picker so it isn't taking a command suggester
                        })
                });
            setting.nameEl.prepend(iconDiv);
            setting.nameEl.addClass("custom-menu-flex");
        });
    }
}



