
'use server';
import { getWaterQualityRecommendation, type WaterQualityRecommendationInput } from '@/ai/flows/water-quality-recommendation';
import { mockWaterSamples, type WaterSample } from '@/data/mock-data';

export async function getRecommendation(input: WaterQualityRecommendationInput) {
  try {
    const result = await getWaterQualityRecommendation(input);
    if (!result || !result.recommendation) {
        throw new Error('Invalid response from AI');
    }
    return { success: true, data: result.recommendation };
  } catch (error) {
    console.error('Error fetching AI recommendation:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to get recommendation: ${errorMessage}` };
  }
}

function getRandomCoordinate(min: number, max: number, decimals: number) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}

// This function now only creates a new sample object without mutating any shared array.
const createWaterSample = (sample: Omit<WaterSample, 'id' | 'date' | 'mercury' | 'cadmium' | 'lat' | 'lng'>, existingSamples: WaterSample[]): WaterSample => {
    const maxId = existingSamples.reduce((max, s) => {
        const idNum = parseInt(s.id.substring(1), 10);
        return idNum > max ? idNum : max;
    }, 0);
    
    const newId = `S${(maxId + 1).toString().padStart(3, '0')}`;

    const newSample: WaterSample = {
        ...sample,
        id: newId,
        date: new Date().toISOString().split('T')[0],
        mercury: getRandomCoordinate(0, 0.008, 3), 
        cadmium: getRandomCoordinate(0, 0.005, 3), 
        lat: getRandomCoordinate(18.57, 18.69, 4), 
        lng: getRandomCoordinate(73.73, 73.89, 4), 
    };
    
    return newSample;
}


export async function addNewSample(
    sample: Omit<WaterSample, 'id' | 'date' | 'mercury' | 'cadmium' | 'lat' | 'lng'>,
    existingSamples: WaterSample[]
) {
    try {
        const newSample = createWaterSample(sample, existingSamples);
        return { success: true, data: newSample };
    } catch(error) {
        console.error('Error adding sample:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, error: `Failed to add sample: ${errorMessage}` };
    }
}
