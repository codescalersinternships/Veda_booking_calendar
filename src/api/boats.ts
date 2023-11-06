import { BoatObject } from '@/utils/types';

export default class BoatsProvider {
  async postBoat(data: BoatObject): Promise<BoatObject> {
    console.log('data: ', data);
    return data;
  }

  async getBoats(): Promise<BoatObject[]> {
    return [];
  }

  async getBoat(id: number) {
    console.log('id: ', id);
  }

  async deleteBoat(id: number) {
    console.log('id: ', id);
  }

  async updateBoat(data: BoatObject, id: number): Promise<BoatObject> {
    console.log('Data, ', data, 'Id, ', id);
    return data;
  }
}
