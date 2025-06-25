import { useSearchParams, type LoaderFunctionArgs } from "react-router";
import type { Route } from "./+types/trips";
import { getAllTrips, getTripById } from "~/appwrite/trips";
import { cn, getFirstWord, parseTripData } from "~/lib/utils";
import { Header, InfoPill, TripCard } from "components";
import { ChipDirective, ChipListComponent, ChipsDirective } from "@syncfusion/ej2-react-buttons";
import { useState } from "react";
import { PagerComponent } from "@syncfusion/ej2-react-grids";

export const loader = async ({request} : LoaderFunctionArgs) => {   
    const limit = 3;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10); 
    const offset = (page-1)*limit;
    //REDUCES LOAD TIME
    const {allTrips, total} = await getAllTrips(limit, offset);

    return {
        allTrips: allTrips.map(({$id, tripDetail, imageUrls}) => ({
            id: $id,
            ...parseTripData(tripDetail),
            imageUrls: imageUrls ?? []
        })),
        total
    }
}

const Trips = ({loaderData}:Route.ComponentProps) => {
  const trips = loaderData?.allTrips as any[] || [];
  const [searchParams] = useSearchParams()
  const initialPage = Number(searchParams.get('page') || '1');

  const [currentPage, setcurrentPage] = useState(initialPage)
  const handlePageChange = ((page:number) => {
    setcurrentPage(page);
    window.location.search = `?page=${page}`
  })

  return (
    <main className="all-users wrapper">
        <Header title="Trips" description="View and edit AI generated travel plans" ctaText="Create a trip" cta="/trips/create"/>
        <section>
          <h1 className="p-24-semibold text-dark-100 mb-5">Manage created trips</h1>
          <div className="trip-grid mb-4">
            {trips.map((trip) => (
                        <TripCard key={trip.id} id={trip.id} name={trip.name} location={trip.itinerary?.[0].location ?? ""} imageUrl={trip.imageUrls[0]} tags={[...[trip.interests], ...[trip.travelStyle]]} price={trip.estimatedPrice}/>
                    ))}
          </div>
          <PagerComponent totalRecordsCount={loaderData.total} pageSize={3} currentPage={currentPage} click={(args) => handlePageChange(args.currentPage)} cssClass="!mb-4"/>
        </section>
    </main>
  )
}
export default Trips