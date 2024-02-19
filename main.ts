import { 
	App,
	debounce,
	Events,
	MarkdownView,
	Menu,
	Plugin,
	setIcon,
	View,
	WorkspaceLeaf
} from 'obsidian';

import { HighlightsItemView, viewType } from 'src/view';

interface HighlightsViewSettings {
}

const DEFAULT_SETTINGS: HighlightsViewSettings = {
}

export default class HighlightsView extends Plugin {
	settings: HighlightsViewSettings;

	async onload() {
		const { app } = this;
		this.initLeaf();

		await this.loadSettings();

		this.registerView(
			viewType,
			(leaf: WorkspaceLeaf) => new HighlightsItemView(leaf, this)
		);

		this.addCommand({
			id: 'open-highlights-view',
			name: 'Open highlights view',
			callback: () => {
				this.initLeaf();
			}
		});

		this.addRibbonIcon('highlighter', 'Show Highlights', () => {
			this.initLeaf();
		});

		this.registerEvent(
			app.metadataCache.on(
				'changed',
				debounce(
					async (file) => {
						const activeView = app.workspace.getActiveViewOfType(MarkdownView);
						if (activeView && file === activeView.file) {
							this.processHighlights();
						}
					},
					100,
					true
				)
			)
		);

		this.registerEvent(
			app.workspace.on(
				'active-leaf-change',
				debounce(
					async (leaf) => {
						app.workspace.iterateRootLeaves((rootLeaf) => {
							if (rootLeaf === leaf) {
								if (leaf.view instanceof MarkdownView) {
									this.processHighlights();
								} else {
									this.view?.setNoContentMessage();
								}
							}
						});
					},
					100,
					true
				)
			)
		);

		(async () => {
			this.processHighlights();
		})();
	}

	onunload() {
		this.app.workspace
			.getLeavesOfType(viewType)
			.forEach((leaf) => leaf.detach());
	}

	get view() {
		const leaves = this.app.workspace.getLeavesOfType(viewType);
		if (!leaves?.length) return null;
		return leaves[0].view as HighlightsView;
	}

	async initLeaf() {
		if (this.view) return this.revealLeaf();

		await this.app.workspace.getRightLeaf(false).setViewState({
			type: viewType,
		});

		this.revealLeaf();

		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView) {
			this.processHighlights();
		}
	}

	revealLeaf() {
		const leaves = this.app.workspace.getLeavesOfType(viewType);
		if (!leaves?.length) return;
		this.app.workspace.revealLeaf(leaves[0]);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	processHighlights = async () => {
		const { settings, view } = this;

		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);

		if (activeView) {
			try {
				const fileContent = await this.app.vault.cachedRead(activeView.file);
				view?.setViewContent(bib);
			} catch (e) {
				console.error(e);
			}
		} else {
			view?.setNoContentMessage();
		}
	};

}
