"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ***** 1) Import your data.json *****
import seedData from "@/data/data.json";

export default function ManualMode() {
  // Store the post-filter results
  const [filteredSeeds, setFilteredSeeds] = useState<any[]>([]);

  // ***** 2) Update our form shape to match relevant fields in the JSON schema *****
  const [formData, setFormData] = useState<{
    // Required
    maturityMin: number;
    maturityMax: number;
    // Optional
    traitTechnology: string;
    // Ranges
    gduMidPollinationMin: number;
    gduMidPollinationMax: number;
    gduBlackLayerMin: number;
    gduBlackLayerMax: number;
    // Additional fields
    kernelRow: string; // we can assume an exact string or a partial
    emergence: number;
    droughtTolerance: number;
    staygreen: number;
    harvestAppearance: number;
  }>({
    maturityMin: 80,
    maturityMax: 120,
    traitTechnology: "",
    gduMidPollinationMin: 800,
    gduMidPollinationMax: 2500,
    gduBlackLayerMin: 1200,
    gduBlackLayerMax: 3000,
    kernelRow: "",
    emergence: 3,
    droughtTolerance: 3,
    staygreen: 3,
    harvestAppearance: 3,
  });

  // Handle text/select changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle slider changes
  const handleSliderChange = (name: string, value: number[]) => {
    setFormData((prev) => ({ ...prev, [name]: value[0] }));
  };

  // ***** 3) Filtering logic *****
  const filterSeeds = () => {
    // Convert the imported object into an array
    const seedsArray = Object.values(seedData);

    const results = seedsArray.filter((seed: any) => {
      // 1) Filter by "maturity" range
      const maturityNum = parseInt(seed.maturity, 10);
      if (
        isNaN(maturityNum) ||
        maturityNum < formData.maturityMin ||
        maturityNum > formData.maturityMax
      ) {
        return false;
      }

      // 2) If trait is chosen, the seed's trait must match
      if (
        formData.traitTechnology &&
        seed.trait &&
        seed.trait.toLowerCase() !== formData.traitTechnology.toLowerCase()
      ) {
        return false;
      }

      // 3) Filter by GDU ranges (if present in seed.characteristics)
      //    The data is a string, so we parse it as an integer
      if (seed.characteristics) {
        const gduMidPoll = parseInt(
          seed.characteristics["Gdus to mid-pollination"] ?? "0",
          10
        );
        if (
          gduMidPoll < formData.gduMidPollinationMin ||
          gduMidPoll > formData.gduMidPollinationMax
        ) {
          return false;
        }

        const gduBlackLayer = parseInt(
          seed.characteristics["Gdus to black layer"] ?? "0",
          10
        );
        if (
          gduBlackLayer < formData.gduBlackLayerMin ||
          gduBlackLayer > formData.gduBlackLayerMax
        ) {
          return false;
        }

        // 4) If kernelRow is provided, check exact match or partial match
        //    Adjust logic as needed. Here we assume an exact match:
        if (
          formData.kernelRow &&
          seed.characteristics["Kernel row"] !== formData.kernelRow
        ) {
          return false;
        }
      }

      // 5) Check agronomics: we only keep seeds where
      //    Emergence >= user setting, Drought tolerance >= user setting, etc.
      if (seed.agronomics) {
        if (seed.agronomics["Emergence"] < formData.emergence) return false;
        if (seed.agronomics["Drought tolerance"] < formData.droughtTolerance)
          return false;
        if (seed.agronomics["Staygreen"] < formData.staygreen) return false;
        if (
          seed.agronomics["Harvest appearance"] < formData.harvestAppearance
        ) {
          return false;
        }
      }

      return true;
    });

    return results;
  };

  // ***** 4) handleSubmit to run the filter logic *****
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const results = filterSeeds();
    setFilteredSeeds(results);
  };

  // ***** 5) Render *****
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
            {/* Maturity Range */}
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
          {/* Basic Requirements */}
          <AccordionItem value="basic-seed-requirements">
            <AccordionTrigger>Basic Seed Requirements</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Trait Technology */}
                <div>
                  <Label htmlFor="traitTechnology">
                    Trait / Technology Preference
                  </Label>
                  <select
                    id="traitTechnology"
                    name="traitTechnology"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.traitTechnology}
                    onChange={handleChange}
                  >
                    <option value="">Any</option>
                    <option value="VT2PRIB">VT2PRIB</option>
                    <option value="SSPRIB">SSPRIB</option>
                    <option value="SmartStax">SmartStax</option>
                    <option value="Roundup Ready">Roundup Ready</option>
                  </select>
                </div>

                {/* Kernel Row */}
                <div>
                  <Label htmlFor="kernelRow">Kernel Row</Label>
                  <input
                    type="text"
                    id="kernelRow"
                    name="kernelRow"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.kernelRow}
                    onChange={handleChange}
                    placeholder="e.g. 16 or 18"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* GDU Requirements */}
          <AccordionItem value="gdu-requirements">
            <AccordionTrigger>GDU Requirements</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GDU to mid-pollination */}
                <div>
                  <Label htmlFor="gduMidPollinationMin">
                    GDUs to Mid-Pollination
                  </Label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      id="gduMidPollinationMin"
                      name="gduMidPollinationMin"
                      className="w-24 px-2 py-1 border rounded-md"
                      value={formData.gduMidPollinationMin}
                      onChange={handleChange}
                    />
                    <span>to</span>
                    <input
                      type="number"
                      id="gduMidPollinationMax"
                      name="gduMidPollinationMax"
                      className="w-24 px-2 py-1 border rounded-md"
                      value={formData.gduMidPollinationMax}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* GDU to black layer */}
                <div>
                  <Label htmlFor="gduBlackLayerMin">
                    GDUs to Black Layer
                  </Label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      id="gduBlackLayerMin"
                      name="gduBlackLayerMin"
                      className="w-24 px-2 py-1 border rounded-md"
                      value={formData.gduBlackLayerMin}
                      onChange={handleChange}
                    />
                    <span>to</span>
                    <input
                      type="number"
                      id="gduBlackLayerMax"
                      name="gduBlackLayerMax"
                      className="w-24 px-2 py-1 border rounded-md"
                      value={formData.gduBlackLayerMax}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Agronomics */}
          <AccordionItem value="agronomics">
            <AccordionTrigger>Agronomics</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Emergence */}
                <div>
                  <Label htmlFor="emergence">Emergence (1-9)</Label>
                  <Slider
                    id="emergence"
                    min={1}
                    max={9}
                    step={1}
                    value={[formData.emergence]}
                    onValueChange={(value) => handleSliderChange("emergence", value)}
                  />
                </div>

                {/* Drought tolerance */}
                <div>
                  <Label htmlFor="droughtTolerance">
                    Drought Tolerance (1-9)
                  </Label>
                  <Slider
                    id="droughtTolerance"
                    min={1}
                    max={9}
                    step={1}
                    value={[formData.droughtTolerance]}
                    onValueChange={(value) =>
                      handleSliderChange("droughtTolerance", value)
                    }
                  />
                </div>

                {/* Staygreen */}
                <div>
                  <Label htmlFor="staygreen">Staygreen (1-9)</Label>
                  <Slider
                    id="staygreen"
                    min={1}
                    max={9}
                    step={1}
                    value={[formData.staygreen]}
                    onValueChange={(value) => handleSliderChange("staygreen", value)}
                  />
                </div>

                {/* Harvest appearance */}
                <div>
                  <Label htmlFor="harvestAppearance">
                    Harvest Appearance (1-9)
                  </Label>
                  <Slider
                    id="harvestAppearance"
                    min={1}
                    max={9}
                    step={1}
                    value={[formData.harvestAppearance]}
                    onValueChange={(value) =>
                      handleSliderChange("harvestAppearance", value)
                    }
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 
            text-white font-medium rounded-xl shadow-lg
            hover:shadow-xl hover:ring-2 hover:ring-green-400 hover:ring-opacity-50 
            transition-all duration-300 ease-in-out"
        >
          Find Varieties
        </button>
      </form>

      {/* ***** 6) Render the filtered seed results below ***** */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Filtered Seed Varieties</h2>
        <div className="space-y-4">
          {filteredSeeds.length === 0 && (
            <p className="text-gray-600">No matching seed varieties found.</p>
          )}
          {filteredSeeds.map((seed: any) => (
            <div
              key={seed.name}
              className="border p-4 rounded-md shadow-sm bg-white"
            >
              <h3 className="text-lg font-bold">{seed.name}</h3>
              <p>
                <strong>Maturity:</strong> {seed.maturity}
              </p>
              <p>
                <strong>Trait:</strong> {seed.trait}
              </p>
              {/* You can also display more details as needed */}
              <ul className="list-disc ml-5 mt-2">
                {seed.strengthAndManagement?.map((point: string, idx: number) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
