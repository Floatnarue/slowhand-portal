import { NextRequest, NextResponse } from "next/server";
import { getPickupStatusBySerialNumber } from "../../../../services/googleSheets";

type RouteParams = {
  sn: string;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<RouteParams> },
) {
  const { sn } = await params;

  if (!sn) {
    return NextResponse.json(
      { message: "Invalid serial number" },
      { status: 400 },
    );
  }

  try {
    const pickupStatus = await getPickupStatusBySerialNumber(sn);

    if (!pickupStatus) {
      return NextResponse.json(
        { message: "Serial Not Found" },
        { status: 404 },
      );
    }

    return NextResponse.json(pickupStatus);
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
