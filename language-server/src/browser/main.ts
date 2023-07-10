import { TextDocument } from 'vscode-languageserver-textdocument';
import { createConnection, BrowserMessageReader, BrowserMessageWriter, InitializeParams, InitializeResult, TextDocuments, InitializedParams } from 'vscode-languageserver/browser';
import init, * as oxigraph from 'oxigraph/web.js';
import { FactPlusPlusReasoner } from '../common/factPlusPlusReasoner';

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);
const connection = createConnection(messageReader, messageWriter);

connection.onInitialize(async (params: InitializeParams): Promise<InitializeResult> => {

	await FactPlusPlusReasoner.initialize(params.initializationOptions.factPlusPlusWasm);
	await init(new URL(params.initializationOptions.oxigraphWasm));
	
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
