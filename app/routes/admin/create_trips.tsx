import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns"
import { Header } from "../../../components/index"
import type { Route } from "./+types/create_trips"

type CountryOption = {
  text: string;
  value: string;
  flag: string;
};

export const loader = async () => {
  const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,cca2')
  const data = await response.json();

  return data;
}

const Create_Trips = ({loaderData}:Route.ComponentProps) => {
  const handleSubmit = async () => {

  }

  const handleChange = (key: keyof TripFormData, value: string | number) => {

  }
  
  const countryOptions = loaderData.map((item: any) => ({
    text: item.name.common,
    value: item.cca2,
    flag: item.flags.svg
  }));

  return (
    <main className="flex flex-col gap-10 pb-20 wrapper">
      <Header title="Add a New Trip" description="View and Edit AI generated travel plans"/>
      <section className="mt-2.5 wrapper-mb">
        <form action="" className="trip-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country">Country:</label>
            <ComboBoxComponent id="country" dataSource={countryOptions} fields={{text:'text', value: 'value'}} placeholder="Select a country" className="combobox" 
              change={(e:{value:string | undefined}) => {
                if(e.value)
                {
                  handleChange('country', e.value)
                }
              }} 
              allowFiltering
              filtering={(e) => {
                const query = e.text.toLowerCase();
                  e.updateData(
                    countryOptions.filter((country: CountryOption) =>
                    country.text.toLowerCase().includes(query)
                    )
                  )
              }}
            />
          </div>
        </form>
      </section>
    </main>
  )
}
export default Create_Trips
