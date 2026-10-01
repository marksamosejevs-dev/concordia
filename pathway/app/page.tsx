import { Hero } from "@/components/sections/Hero";
import { DecisionSet } from "@/components/sections/DecisionSet";
import {
  Silence, BuiltInsideFootball, AssessmentProduct, ReportPreview, SuccessRedefined, MarketsTeaser, FindPathTeaser,
  ProgrammesSection, CasesSection, AgencyPlayersRail, KnowWhatYouGetInto, PricingSection, NotRepresentation,
  TestimonialsSection, FaqSection, FinalCta,
} from "@/components/sections/HomeSections";

export default function Home() {
  return (
    <>
      <Hero />                 {/* 01 */}
      <Silence />              {/* 02 */}
      <DecisionSet />          {/* 03 */}
      <BuiltInsideFootball />  {/* 04 team + verify */}
      <AssessmentProduct />    {/* 05 */}
      <ReportPreview />        {/* 06 */}
      <SuccessRedefined />     {/* 07 */}
      <MarketsTeaser />        {/* 08 */}
      <FindPathTeaser />       {/* 09 */}
      <ProgrammesSection />    {/* 10 */}
      <CasesSection />         {/* 11 */}
      <AgencyPlayersRail />    {/* 12 */}
      <KnowWhatYouGetInto />   {/* 13 */}
      <PricingSection />       {/* 14 */}
      <NotRepresentation />    {/* 15 */}
      <TestimonialsSection />  {/* 16 — conditional */}
      <FaqSection />           {/* 17 */}
      <FinalCta />             {/* 18 */}
    </>
  );
}
