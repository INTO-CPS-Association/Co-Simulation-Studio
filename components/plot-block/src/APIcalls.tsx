

//ts plot component that handles general customizations which is then passed


//update mark & encoding
//setmark function
//pass string through spec to mark

//setEncoding
//1. swap axises
//2. rename axises


//Function to enumerate dropdown menu

//function to fetch json from list based on enumeration



//This function is supposed to recieve/fetch json specs
export function FetchJsonAssets(spec1: any, spec2: any, spec3: any, spec4: any){
    //create list object from specs tuples? name/key

    var specOptions = [];
    specOptions.push(1, spec1.mark)
    specOptions.push(2, spec2.mark)
    specOptions.push(3, spec3.mark)
    specOptions.push(4, spec4.mark)
    console.log(specOptions)
    
    return specOptions
  };

export function jsonToSpec(path: string, spec: any) {
    const json = require(path);

    spec.data = json.data;
    spec.description = json.description;
    spec.encoding = json.encoding;
    spec.mark = json.mark;
    return spec;
  };



//colorpicker function
export function changeChartColor(hexColor: String)
{
    console.log('Hex color:', hexColor);
}