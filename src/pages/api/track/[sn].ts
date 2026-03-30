import type { NextApiRequest, NextApiResponse } from 'next';
import { getPickupStatusBySerialNumber, PickupStatus } from '../../../services/googleSheets';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PickupStatus | { message: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { sn } = req.query;

  if (!sn || Array.isArray(sn)) {
    return res.status(400).json({ message: 'Invalid serial number' });
  }

  try {
    const pickupStatus = await getPickupStatusBySerialNumber(sn);

    if (!pickupStatus) {
      return res.status(404).json({ message: 'Serial Not Found' });
    }

    return res.status(200).json(pickupStatus);
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
}
