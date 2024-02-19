export default class GetHighlights {
	process(data: string): { id: string, text: string }[] {
		let re: RegExp = /(==|\<mark\>)([\s\S]*?)(==|\<\/mark\>)/g;
		let matches = data.match(re);
		let highlights: { id: string, text: string }[] = [];

		if (matches) {
			matches.forEach((match) => {
				let cleanText = match
					.replace(/==/g, "")
					.replace(/\<mark\>/g, "")
					.replace(/\<\/mark\>/g, "")
					.replace(/\*\*/g, "");
				highlights.push({ id: cleanText, text: cleanText });
			});
		}

		return highlights;
	}
}
