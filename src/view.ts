import {
	ItemView,
	MarkdownView,
	setIcon,
	WorkspaceLeaf
} from 'obsidian';

import GetHighlights from 'src/getHighlights';
import HighlightsView from './main';

export const viewType = 'HighlightsView';

export class HighlightsItemView extends ItemView {
	plugin: HighlightsView;
	activeMarkdownLeaf: MarkdownView;

	constructor(leaf: WorkspaceLeaf, plugin: HighlightsView) {
		super(leaf);
		this.plugin = plugin;

		this.contentEl.addClass('highlights-list');
		this.setNoContentMessage();
	}

	async setViewContent() {
		const activeLeaf = this.app.workspace.activeLeaf;
		if (activeLeaf && activeLeaf.view instanceof MarkdownView) {
			const markdownContent = await activeLeaf.view.data;
			const processor = new GetHighlights();
			const highlights = processor.process(markdownContent);

			this.contentEl.empty();

			highlights.forEach(({ id, text }) => {
				const div = this.contentEl.createDiv({ cls: 'search-result-file-match', text: text });
				div.addEventListener('click', () => {
					this.scrollToHighlight(id);
				});
			});
		} else {
			this.setNoContentMessage();
		}
	}

	scrollToHighlight(highlightId: string) {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeView) return;

		// todo
	}

	displayHighlights(highlights: string) {	
		this.contentEl.empty();
		const div = this.contentEl.createDiv();
		div.createEl('div').textContent = highlights;
	}

	setNoContentMessage() {
		this.setMessage('No highlights found.');
	}

	setMessage(message: string) {
		this.contentEl.empty();
		this.contentEl.createDiv({
			cls: 'pane-empty',
			text: message,
		});
	}

	getViewType(): string {
		return viewType;
	}

	getDisplayText(): string {
		return "Highlights";
	}

	getIcon(): string {
		return 'highlighter';
	}


}
