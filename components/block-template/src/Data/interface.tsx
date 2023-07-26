
export interface BlockProps {
  data: any;
  id: string;
  onDataChange: (newData: any) => void;

}

export interface BlockData {
	id: string;  
	type: string;
	data: any;
}

export interface BlockContextProps {
  projectData: BlockData[];
  setProjectData: React.Dispatch<React.SetStateAction<BlockData[]>>;
  handleBlockDelete: (id: string) => void;
}


export interface BlockProviderProps {
  children: React.ReactNode;
}
