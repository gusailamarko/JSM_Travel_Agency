import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns"
import { Header } from "../../../components/index"
import type { Route } from "./+types/create_trips"
import { comboBoxItems, selectItems } from "~/constants";
import { cn, formatKey } from "~/lib/utils";
import { animate, LayerDirective, LayersDirective, MapsComponent } from "@syncfusion/ej2-react-maps";
import { useState } from "react";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";
import { useNavigate } from "react-router";

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
  const countries = loaderData;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<TripFormData>({
    country: countries[0]?.name || '',
    travelStyle: '',
    interest: '',
    budget: '',
    duration: 0,
    groupType: ''
  })
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if(!formData.country || !formData.travelStyle || !formData.interest || !formData.budget || !formData.groupType)
    {
      setError("You haven't filled out all the fields!")
      setLoading(false);
      return;
    }

    if(formData.duration < 1 || formData.duration > 10)
    {
      setError("Duration must be between 1 and 10 days");
      setLoading(false);
      return;
    }

    const user = await account.get();
    if(!user.$id)
    {
      console.error("User not authenticated!");
      setLoading(false);
      return;
    }

    try
    {
      const response = await fetch('/api/create-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          country: formData.country,
          duration: formData.duration,
          travelStyle: formData.travelStyle,
          interests: formData.interest,
          budget: formData.budget,
          groupType: formData.groupType,
          userID: user.$id
        })
      })

      const result:CreateTripResponse = await response.json();

      if(result?.id)
      {
        navigate(`trips/${result.id}`);
      }
      else
      {
        console.error("Failed to generate a trip!");
      }
    }
    catch(e)
    {
      console.log("Error generating trip: ", e);
    }
    finally
    {
      setLoading(false);
    }
  }

  const handleChange = (key: keyof TripFormData, value: string | number) => {
    setFormData({...formData, [key]: value})
  }
  
  const countryOptions = loaderData.map((item: any) => ({
    text: item.name.common,
    value: item.cca2,
    flag: item.flags.svg
  }));

  const mapData = [
    {
      country: countries.find((c:any) => c.cca2 === formData.country)?.name.common || '',
      color: '#EA382E',
      coordinates: countries.find((c:any) => c.cca2 === formData.country)?.coordinates || []
    }
  ]

  return (
    <main className="flex flex-col gap-10 pb-20 wrapper">
      <Header title="Add a New Trip" description="View and Edit AI generated travel plans"/>
      <section className="mt-2.5 wrapper-mb">
        <form action="" className="trip-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country">Country:</label>
            <ComboBoxComponent id="country" dataSource={countryOptions} fields={{text:'text', value: 'value'}} placeholder="Select a country" className="combo-box" 
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
          <div>
            <label htmlFor="duration">Duration:</label>
            <input id="duration" name="duration" placeholder="Enter a number of days" className="form-input placeholder:text-gray-100" onChange={(e) => handleChange('duration', Number(e.target.value))}/>
          </div>
          {selectItems.map((item) => (
            <div key={item}>
              <label htmlFor={item}>Select your {formatKey(item)}</label>
              <ComboBoxComponent
                className="combo-box"
                fields={{text:'text', value: 'value'}} placeholder={`Select ${formatKey(item)}`}
                id={item}
                dataSource={comboBoxItems[item].map((item) => ({
                  text: item,
                  value: item
                }))}
                change={(e:{value:string | undefined}) => {
                  if(e.value)
                  {
                    handleChange(item, e.value)
                  }
                }} 
                allowFiltering
                filtering={(e) => {
                  const query = e.text.toLowerCase();
                  e.updateData(
                    comboBoxItems[item].filter((item) =>
                      item.toLowerCase().includes(query)).map((item) => ({
                        text: item,
                        value: item
                      }))
                  )
                }}
              />
            </div>
          ))}
          <div>
            <label htmlFor="location">Location on the world map:</label>
            <MapsComponent>
              <LayersDirective>
                <LayerDirective dataSource={mapData} shapeData={world_map} shapePropertyPath="name" shapeDataPath="country" shapeSettings={{colorValuePath: 'color', fill: '#e5e5e5'}}/>
              </LayersDirective>
            </MapsComponent>
          </div>

          <div className="bg-gray-200 h-px w-full"/>
          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}
          <footer className="px-6 w-full">
            <ButtonComponent type="submit" className="button-class !h-12 !w-full" disabled={loading}>
              <img src={`/assets/icons/${loading ? 'loader.svg' : 'magic-star.svg'}`} alt="" className={cn('size-5', {'animate-spin' : loading})}/>
              <span className="p-16-semibold text-white">
                {loading ? 'Generating...' : 'Generate Trip'}
              </span>
            </ButtonComponent>
          </footer>
        </form>
      </section>
    </main>
  )
}
export default Create_Trips
