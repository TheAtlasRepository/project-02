import { extractCoordinates, Coordinate } from '../functions/CoordinateExtractor'; // Adjust the import path
import axios from 'axios';

export const handleDataFetching = async (
  url: string,
  payload: any,
  setJsonData: React.Dispatch<React.SetStateAction<any>>,
  setMarkers: React.Dispatch<React.SetStateAction<{ latitude: number; longitude: number; type: string }[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setLocalEditedText?: React.Dispatch<React.SetStateAction<string>>,
  additionalLogic?: (data: any) => void
) => {
  setLoading(true);

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = response.data;

    console.log('JSON data from the backend:', data);

    // If a GeoJSON path is provided, fetch the GeoJSON data
    if (data.selected_countries_geojson_path) {
      const geoJsonData = data.selected_countries_geojson_path;

      // Now you have the GeoJSON data
      console.log('GeoJSON data:', geoJsonData);

      // Extract entities and filter out unnecessary strings
      const filteredEntities = data.entities
        .map((entry: any) => entry.filter((item: any) => Array.isArray(item) && item.length === 2))
        .flat();

      console.log('Filtered Entities:', filteredEntities);

      const coordinates: Coordinate[] = extractCoordinates(filteredEntities);
      console.log('Extracted Coordinates:', coordinates);

      // place the markers on the map
      const coordinatesArray = coordinates.map((coordinate) => [coordinate.longitude, coordinate.latitude]);
      console.log('Coordinates Array:', coordinatesArray);

      // Calculate the center coordinates
      const centerCoordinates = coordinatesArray.reduce(
        (accumulator, currentValue) => [accumulator[0] + currentValue[0], accumulator[1] + currentValue[1]],
        [0, 0]
      );
      console.log('Center Coordinates:', centerCoordinates);

      // Proceed with the rest of your logic, e.g., extracting coordinates, setting markers, etc.

    setJsonData(data);
    setMarkers(coordinates as { latitude: number; longitude: number; type: string }[]);

    if (setLocalEditedText) {
      setLocalEditedText(payload.editedText);
    }

      if (additionalLogic) {
        additionalLogic(data);
      }

      setLoading(false);
    } else {
      // Handle the case where no GeoJSON path is provided in the backend response
      console.error('No GeoJSON path provided in the backend response.');

      // Set loading to false
      setLoading(false);
    }

   } 
   catch (error) {
      console.error('Error fetching JSON data:', error);

      if (setLocalEditedText) {
        setLocalEditedText(payload.editedText);
      }

      setLoading(false);
    }
  };

export const handleSaveChat = async (
    localEditedText: string,
    setEditingText: React.Dispatch<React.SetStateAction<boolean>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setJsonData: React.Dispatch<React.SetStateAction<any>>,
    setMarkers: React.Dispatch<React.SetStateAction<{ latitude: number; longitude: number; type: string }[]>>,
    setLocalEditedText: React.Dispatch<React.SetStateAction<string>>,
    prevEditedTextRef: React.MutableRefObject<string | undefined>
  ) => {
    if (localEditedText !== prevEditedTextRef.current) {
        setEditingText(false);
        await handleDataFetching(
            `http://127.0.0.1:8000/newChat?message=${localEditedText}`,
          { editedText: localEditedText },
          setJsonData,
          setMarkers,
          setLoading,
          setLocalEditedText
        );
    }
  };


export const handleSendChat = async (
    inputText: string,
    setJsonData: React.Dispatch<React.SetStateAction<any>>,
    setMarkers: React.Dispatch<React.SetStateAction<{ latitude: number; longitude: number; type: string }[]>>,
    setInputText: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (inputText.trim() !== '') {
      await handleDataFetching(
            'http://127.0.0.1:8000/moreChat?message=' + inputText,
        { inputText },
        setJsonData,
        setMarkers,
        setLoading,
        // Set the input text to empty after sending the request
        setInputText
      );
    } else {
      // Handle case where inputText is empty
      console.log('Input text is empty. Not sending the request.');
    }
  };

  export const handleSendTextInput = async (
    inputText: string,
    setJsonData: React.Dispatch<React.SetStateAction<any>>,
    setMarkers: React.Dispatch<React.SetStateAction<{ latitude: number; longitude: number; type: string }[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (inputText.trim() !== '') {
      await handleDataFetching(
        'http://127.0.0.1:8000/newText?text=' + inputText,
        { inputText },
        setJsonData,
        setMarkers,
        setLoading
      );
    } else {
      // Handle case where inputText is empty
      console.log('Input text is empty. Not sending the request.');
    }
  };
