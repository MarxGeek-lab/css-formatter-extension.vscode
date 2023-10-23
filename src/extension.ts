import * as vscode from 'vscode';
import * as prettier from 'prettier';


async function sortCSSProperties(editor: vscode.TextEditor | undefined) {
	if (!editor) {
		return;
	}

	const textEditor = vscode.window.activeTextEditor; // activé l'accès au méthode de l'éditeur 
	const document = textEditor?.document; // accès au fichier

	const fileDocument = editor.document; //accéder au contenu de l'éditeur
	const textStyle = fileDocument.getText(); // récupéré le texte du fichier
	let sortedText:string | undefined = "";
	let formattedText:string = "";

	if (document?.languageId === "scss") {
		console.log("scss");
	} else if (document?.languageId === "css") {
		const cssBlocks = textStyle.match(/(?<={)(.*?)(?=\})/gs);

		if (!cssBlocks) {
		return;
		}

		const sortedBlocks = cssBlocks.map((block) => {
			// trie en ordre alphabétique
			const lines = block
				.split('\n')
				.sort((a, b) => {
					const propertyA = a.split(':')[0];
					const propertyB = b.split(':')[0];
					return propertyA.localeCompare(propertyB);
				});

			return lines.join('\n');
		});

		// reconstruire le texte
		sortedText = textStyle;
		for (let i = 0; i < cssBlocks.length; i++) {
			sortedText = sortedText.replace(cssBlocks[i], sortedBlocks[i]);
		}
	}

	formattedText = await prettier.format(sortedText, { parser: 'css' });
	editor.edit((editBuilder) => {
		editBuilder.replace(new vscode.Range(fileDocument.positionAt(0), fileDocument.positionAt(textStyle.length)), formattedText);
	})
} 


export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "css/scss-formatter" is now active!');
	
	const disposable = vscode.commands.registerCommand('extension.sortCSSProperties', () => {
		const editor = vscode.window.activeTextEditor;
		sortCSSProperties(editor);
	})

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log("Désactivation de l'extension");
}


