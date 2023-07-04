import React, { useEffect, useState } from 'react';
import images from './example-template.json';
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react';

//Missing comment
const ChoiceGroupComponent = () => {
    const [options, setOptions] = useState<IChoiceGroupOption[]>([]);

    //Missing comment
    useEffect(() => {
        const newOptions = images.map((item: any, index: number) => ({
                key: index.toString(),
                text: item.title,
                imageSrc: item.image,
                imageSize: { width: 128, height: 128},
            })
        );
        setOptions(newOptions);
    }, []);

    //returns the component 
    return (
        <div>
            <h1>Choose a Template</h1>
            <ChoiceGroup
                options={options}
                label = "Block Templates"
                required={true}
            />
        </div>
    );
};

//Missing comment
export default ChoiceGroupComponent;
