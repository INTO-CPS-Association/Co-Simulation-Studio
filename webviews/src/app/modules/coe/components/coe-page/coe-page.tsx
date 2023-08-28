import React, { useState } from 'react';
import { Panel } from '@fluentui/react';

//interface for props - change later?
interface AppPanelProps {
	id: string;
	title: string;
	open?: boolean;
	children: React.ReactNode;
  }
  

//---------Panel Component----------------
const AppPanel: React.FC<AppPanelProps> = ({ id, title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={styles.panel}>
            <div style={styles.panelHeaderContainer}>
                <h2 style={styles.panelHeader}>{title}</h2>
                <div style={styles.arrow} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? '▼' : '►'}
                </div>
            </div>
            {isOpen && <div>{children}</div>}
        </div>
    );
};

//styling for panel 
const styles = {
    panel: {
        padding: '5px 15px 0 15px',  // Removed bottom padding
        border: '1px solid #e1e1e1',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
        backgroundColor: '#f3f3f3',
        width: '100%',
        margin: '20px auto',
    },
    panelHeaderContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    panelHeader: {
        marginTop: 0,
        paddingBottom: '2px',  // Reduced bottom padding
        flex: 1,
        fontSize: '1.2em',
    },
    arrow: {
        cursor: 'pointer',
        fontSize: '1.2em',
        marginLeft: '10px',
        userSelect: 'none' as 'none',
    },
};


//----------Other Components----------------
//TODO: implement correct pathing to components e.g. add path as input 
const CoeConfiguration = ({  }) => {
	return <div>Coe Configuration Component</div>;
  };
  
  const CoeLaunch = () => {
	return <div>Coe Launch Component</div>;
  };
  
  const CoeSimulation = ({ }) => {
	return <div>Coe Simulation Component</div>;
  };
  

//----------COE Page Component----------------
export default function CoePageReact(props: any) {
	return (
		<>
		<AppPanel id="Configuration" title="Configuration" open={true}>
		  <CoeConfiguration/>
		</AppPanel>
		
		<AppPanel id="Simulation" title="Simulation" open={false}>
		  <CoeLaunch />
		  <CoeSimulation />
		</AppPanel>
	  </>
	);
}