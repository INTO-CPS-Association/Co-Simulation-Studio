import React from 'react';
import { BlockProps } from "../Data/interface"
import CodeSnippetBlock from '../Blocks/CodeSnippetBlock';
import AudioBlock from '../Blocks/AudioBlock';
import TextBlock from '../Blocks/TextBlock';
import ImageBlock from '../Blocks/ImageBlock';

//------------------ SERVICE TO HANDLE BLOCK TEMPLATES ------------------//
class BlockService {
	private blockMap: { [key: string]: React.FC<BlockProps> } = {};

	constructor() {
        this.blockMap = {
            //'text': TextBlock,
            'Image': ImageBlock,
            'Audio': AudioBlock,
            'Code': CodeSnippetBlock,
			'Text': TextBlock
        };
    }

	//------------------ Setters and Getters ------------------//
	registerBlock(type: string, component: React.FC<BlockProps>) {
		this.blockMap[type] = component;
	}

	getBlock(type: string) {
		return this.blockMap[type];
	}

	getBlockTypes() {
        return Object.keys(this.blockMap);
    }
}


//create instance of service
const blockService = new BlockService();

//register blocks
blockService.registerBlock('Code', CodeSnippetBlock);
blockService.registerBlock('Audio', AudioBlock);
blockService.registerBlock('Image', ImageBlock);
blockService.registerBlock('Text', TextBlock);


export default blockService;

