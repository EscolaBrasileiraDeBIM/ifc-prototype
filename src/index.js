import {IfcAPI} from "web-ifc/web-ifc-api";
import ShortUniqueId from "short-unique-id";
//import { copyFileSync, constants } from 'node:fs';
import {fs} from 'node:fs';

const ifcFileLocation = "./IFC/1. rac_basic_sample_project.ifc";


let modelID = 0;
let maxLine;
const ifcapi = new IfcAPI();

function getIfcFile(url) {
    return new Promise((resolve, reject) => {
        var oReq = new XMLHttpRequest();
        oReq.responseType = "arraybuffer";
        oReq.addEventListener("load", () => {
            resolve(new Uint8Array(oReq.response));
        });
        oReq.open("GET", url);
        oReq.send();
    });
}

ifcapi.Init().then(()=>{
    ifcapi.SetWasmPath("../../../../");
    getIfcFile(ifcFileLocation).then((ifcData) => {
        modelID = ifcapi.OpenModel(ifcData);
        let isModelOpened = ifcapi.IsModelOpen(modelID);
        console.log({isModelOpened});

        const uid = new ShortUniqueId({length: 22});
        console.log(uid());

        getMaxExpressID(modelID);

        const fse = new fs();




        fse.copyFileSync('./IFC/1. rac_basic_sample_project.ifc', './1. rac_basic_sample_project.txt').then((_) => {
            console.log('source.txt was copied to destination.txt');
        });



        ifcapi.CloseModel(modelID);
    });
});

function getMaxExpressID (modelID) {
    let size = ifcapi.GetAllLines(modelID).size();
    const allLines = ifcapi.GetAllLines(modelID);
    // const allItems = 1;
    // while( size >= 0){
    //     ifcapi.Get
    //     size--;
    // }
    const prt = allLines.$$.ptr;
    const a = ifcapi.GetIndexArray(prt, size);
    console.log(a);
    console.log(size);
    console.log(allLines);
}

function GetAllItems(modelID, excludeGeometry = false) {
    const allItems = {};
    const lines = ifcapi.GetAllLines(modelID);
    maxLine = ifcapi.GetAllLines(modelID);
    getAllItemsFromLines(modelID, lines, allItems, excludeGeometry);
    return allItems;
  }
  
  function getAllItemsFromLines(modelID, lines, allItems, excludeGeometry) {
    for (let i = lines.size(); i <= lines.size(); i++) {
      try {
        saveProperties(modelID, lines, allItems, excludeGeometry, i);
      } catch (e) {
        console.log(e);
      }
    }
  }
  
  function saveProperties(modelID, lines, allItems, excludeGeometry, index) {
    const itemID = lines.get(index);
    const props = ifcapi.GetLine(modelID, itemID);
    props.type = props.__proto__.constructor.name;
    if (!excludeGeometry || !geometryTypes.has(props.type)) {
      allItems[itemID] = props;
    }
  }