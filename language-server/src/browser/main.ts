import { TextDocument } from 'vscode-languageserver-textdocument';
import { createConnection, BrowserMessageReader, BrowserMessageWriter, InitializeParams, InitializeResult, TextDocuments, InitializedParams } from 'vscode-languageserver/browser';

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);
const connection = createConnection(messageReader, messageWriter);

connection.onInitialize(async (params: InitializeParams): Promise<InitializeResult> => {

	return {
		capabilities: {

		}
	};

});

connection.onInitialized(async (params: InitializedParams) => {
	//
});

connection.onDidChangeWatchedFiles(change => {
	//
});

const documents = new TextDocuments(TextDocument);

documents.onDidChangeContent(e => {
	//
});

documents.listen(connection);

connection.listen();
