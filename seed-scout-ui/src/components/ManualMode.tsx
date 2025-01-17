'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ManualMode() {
  const [formData, setFormData] = useState<{
    region: string;
    maturityMin: number;
    maturityMax: number;
    traitTechnology: string;
    plantingRate: string;
    droughtTolerance: number;
    rootStrength: number;
    stalkStrength: number;
    seedlingGrowth: number;
    greensnap: number;
    harvestAppearance: number;
    drydown: number;
    testWeight: number;
    diseases: {
      grayLeafSpot: boolean;
      commonRust: boolean;
      anthracnoseStalkRot: boolean;
      gossWilt: boolean;
      eyeSpot: boolean;
      northernCornLeafBlight: boolean;
    };
    herbicideSensitivity: {
      growthRegulators: boolean;
      isoxazoles: boolean;
      sulfonylureas: boolean;
    };
    isNewProduct: boolean | null;
    cobColor: string;
    kernelRows: string;
    gduMidPollination: string;
    gduBlackLayer: string;
  }>({
    region: '',
    maturityMin: 80,
    maturityMax: 120,
    traitTechnology: '',
    plantingRate: '',
    droughtTolerance: 5,
    rootStrength: 5,
    stalkStrength: 5,
    seedlingGrowth: 5,
    greensnap: 5,
    harvestAppearance: 5,
    drydown: 5,
    testWeight: 5,
    diseases: {
      grayLeafSpot: false,
      commonRust: false,
      anthracnoseStalkRot: false,
      gossWilt: false,
      eyeSpot: false,
      northernCornLeafBlight: false,
    },
    herbicideSensitivity: {
      growthRegulators: false,
      isoxazoles: false,
      sulfonylureas: false,
    },
    isNewProduct: null,
    cobColor: '',
    kernelRows: '',
    gduMidPollination: '',
    gduBlackLayer: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      diseases: { ...prev.diseases, [name]: !prev.diseases[name as keyof typeof prev.diseases] }
    }))
  }

  const handleHerbicideChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      herbicideSensitivity: { ...prev.herbicideSensitivity, [name]: !prev.herbicideSensitivity[name as keyof typeof prev.herbicideSensitivity] }
    }))
  }

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData(prev => ({ ...prev, [name]: value[0] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Manual mode form data:', formData)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Required Fields</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="region">Region / Location</Label>
              <select
                id="region"
                name="region"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.region}
                onChange={handleChange}
                required
              >
                <option value="">Select region</option>
                <option value="midwest">Midwest</option>
                <option value="northeast">Northeast</option>
                <option value="southeast">Southeast</option>
                <option value="southwest">Southwest</option>
                <option value="west">West</option>
              </select>
            </div>
            <div>
              <Label htmlFor="maturityRange">Maturity Range (days)</Label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  id="maturityMin"
                  name="maturityMin"
                  className="w-20 px-2 py-1 border rounded-md"
                  value={formData.maturityMin}
                  onChange={handleChange}
                  min={60}
                  max={150}
                  required
                />
                <span>to</span>
                <input
                  type="number"
                  id="maturityMax"
                  name="maturityMax"
                  className="w-20 px-2 py-1 border rounded-md"
                  value={formData.maturityMax}
                  onChange={handleChange}
                  min={60}
                  max={150}
                  required
                />
              </div>
            </div>
          </div>
        </section>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="basic-seed-requirements">
            <AccordionTrigger>Basic Seed Requirements</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="traitTechnology">Trait / Technology Preference</Label>
                  <select
                    id="traitTechnology"
                    name="traitTechnology"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.traitTechnology}
                    onChange={handleChange}
                  >
                    <option value="">Select trait/technology</option>
                    <option value="vt2prib">VT2PRIB</option>
                    <option value="smartstax">SmartStax</option>
                    <option value="roundupReady">Roundup Ready</option>
                  </select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="agronomics-management">
            <AccordionTrigger>Agronomics & Management</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plantingRate">Planting Rate</Label>
                  <select
                    id="plantingRate"
                    name="plantingRate"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.plantingRate}
                    onChange={handleChange}
                  >
                    <option value="">Select planting rate</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="droughtTolerance">Drought Tolerance (1-9)</Label>
                  <Slider
                    id="droughtTolerance"
                    min={1}
                    max={9}
                    step={1}
                    value={[formData.droughtTolerance]}
                    onValueChange={(value) => handleSliderChange('droughtTolerance', value)}
                  />
                </div>
                <div>
                  <Label htmlFor="rootStrength">Root Strength (1-9)</Label>
                  <Slider
                    id="rootStrength"
                    min={1}
                    max={9}
                    step={1}
                    value={[formData.rootStrength]}
                    onValueChange={(value) => handleSliderChange('rootStrength', value)}
                  />
                </div>
                <div>
                  <Label htmlFor="stalkStrength">Stalk Strength (1-9)</Label>
                  <Slider
                    id="stalkStrength"
                    min={1}
                    max={9}
                    step={1}
                    value={[formData.stalkStrength]}
                    onValueChange={(value) => handleSliderChange('stalkStrength', value)}
                  />
                </div>
                <div>
                  <Label htmlFor="seedlingGrowth">Seedling Growth (1-9)</Label>
                  <Slider
                    id="seedlingGrowth"
                    min={1}
                    max={9}
                    step={1}
                    value={[formData.seedlingGrowth]}
                    onValueChange={(value) => handleSliderChange('seedlingGrowth', value)}
                  />
                </div>
                <div>
                  <Label htmlFor="greensnap">Greensnap Tolerance (1-9)</Label>
                  <Slider
                    id="greensnap"
                    min={1}
                    max={9}
                    step={1}
                    value={[formData.greensnap]}
                    onValueChange={(value) => handleSliderChange('greensnap', value)}
                  />
                </div>
                <div>
                  <Label htmlFor="harvestAppearance">Harvest Appearance (1-9)</Label>
                  <Slider
                    id="harvestAppearance"
                    min={1}
                    max={9}
                    step={1}
                    value={[formData.harvestAppearance]}
                    onValueChange={(value) => handleSliderChange('harvestAppearance', value)}
                  />
                </div>
                <div>
                  <Label htmlFor="drydown">Drydown (1-9)</Label>
                  <Slider
                    id="drydown"
                    min={1}
                    max={9}
                    step={1}
                    value={[formData.drydown]}
                    onValueChange={(value) => handleSliderChange('drydown', value)}
                  />
                </div>
                <div>
                  <Label htmlFor="testWeight">Test Weight (1-9)</Label>
                  <Slider
                    id="testWeight"
                    min={1}
                    max={9}
                    step={1}
                    value={[formData.testWeight]}
                    onValueChange={(value) => handleSliderChange('testWeight', value)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="disease-tolerance">
            <AccordionTrigger>Disease Tolerance</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(formData.diseases).map(([disease, checked]) => (
                  <div key={disease} className="flex items-center space-x-2">
                    <Checkbox
                      id={disease}
                      checked={checked}
                      onCheckedChange={() => handleCheckboxChange(disease)}
                    />
                    <Label htmlFor={disease}>{disease.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="herbicide-sensitivity">
            <AccordionTrigger>Herbicide Sensitivity</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(formData.herbicideSensitivity).map(([herbicide, checked]) => (
                  <div key={herbicide} className="flex items-center space-x-2">
                    <Checkbox
                      id={herbicide}
                      checked={checked}
                      onCheckedChange={() => handleHerbicideChange(herbicide)}
                    />
                    <Label htmlFor={herbicide}>{herbicide.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="additional-considerations">
            <AccordionTrigger>Additional Considerations</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="isNewProduct">New or Existing Product</Label>
                  <RadioGroup
                    onValueChange={(value) => setFormData(prev => ({ ...prev, isNewProduct: value === 'true' }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="new" />
                      <Label htmlFor="new">New</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="existing" />
                      <Label htmlFor="existing">Existing</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="cobColor">Cob Color</Label>
                  <input
                    type="text"
                    id="cobColor"
                    name="cobColor"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.cobColor}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="kernelRows">Kernel Row Number</Label>
                  <input
                    type="text"
                    id="kernelRows"
                    name="kernelRows"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.kernelRows}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="gduMidPollination">GDUs to Mid-Pollination</Label>
                  <input
                    type="text"
                    id="gduMidPollination"
                    name="gduMidPollination"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.gduMidPollination}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="gduBlackLayer">GDUs to Black Layer</Label>
                  <input
                    type="text"
                    id="gduBlackLayer"
                    name="gduBlackLayer"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.gduBlackLayer}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
        >
          Find Varieties
        </button>
      </form>
    </motion.div>
  )
}

