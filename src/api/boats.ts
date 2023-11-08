import { boats } from '@/api/dummy_data';
import { BoatApiData } from '@/utils/types';

export default class BoatsProvider {
  async post(data: BoatApiData): Promise<BoatApiData> {
    console.log('data: ', data);
    return data;
  }

  async all(): Promise<BoatApiData[]> {
    return boats;
  }

  async get(id: number) {
    console.log('id: ', id);
  }

  async delete(id: number) {
    console.log('id: ', id);
  }

  async update(data: BoatApiData, id: number): Promise<BoatApiData> {
    console.log('Data, ', data, 'Id, ', id);
    return data;
  }
}
