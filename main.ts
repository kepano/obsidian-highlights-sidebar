import { 
	App, 
	Plugin, 
	PluginSettingTab,
	Setting,
	View,
	WorkspaceLeaf
} from 'obsidian';

interface HighlightsSidebarSettings {
}

const DEFAULT_SETTINGS: HighlightsSidebarSettings = {
}

import HighlightsView from 'view/view';
import { HIGHLIGHTS_VIEW_TYPE } from './constants';

export default class HighlightsSidebar extends Plugin {
	settings: HighlightsSidebarSettings;
	public view: HighlightsView;

	async onload() {
		await this.loadSettings();

		this.registerView(
			HIGHLIGHTS_VIEW_TYPE,
			(leaf: WorkspaceLeaf) => this.createHighlightsView(leaf)
		);

		this.addCommand({
			id: 'open-highlights-view',
			name: 'Open highlights view',
			callback: () => {
				this.showSidebar();
			}
		});


		this.addRibbonIcon('highlighter', 'Show Highlights', () => {
			this.showSidebar();
		});
	}

	onunload() {
		this.app.workspace
			.getLeavesOfType(HIGHLIGHTS_VIEW_TYPE)
			.forEach((leaf) => leaf.detach());
	}

	showSidebar() {
		this.app.workspace
			.getRightLeaf(true)
			.setViewState({ type: HIGHLIGHTS_VIEW_TYPE });
	}

	createHighlightsView(leaf: WorkspaceLeaf) {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
