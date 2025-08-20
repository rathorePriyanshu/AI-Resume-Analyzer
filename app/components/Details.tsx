import DetailsHeader from "./DetailsHeader";
import DetailsContent from "./DetailsContent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      // defaultValue={["item-1", "item-2", "item-3", "item-4"]}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <DetailsHeader
            title="Tone & Style"
            categoryScore={feedback.toneAndStyle.score}
          />
        </AccordionTrigger>
        <AccordionContent>
          <DetailsContent tips={feedback.toneAndStyle.tips} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>
          <DetailsHeader
            title="Content"
            categoryScore={feedback.content.score}
          />
        </AccordionTrigger>
        <AccordionContent>
          <DetailsContent tips={feedback.content.tips} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger>
          <DetailsHeader
            title="Structure"
            categoryScore={feedback.structure.score}
          />
        </AccordionTrigger>
        <AccordionContent>
          <DetailsContent tips={feedback.structure.tips} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4">
        <AccordionTrigger>
          <DetailsHeader title="Skills" categoryScore={feedback.skills.score} />
        </AccordionTrigger>
        <AccordionContent>
          <DetailsContent tips={feedback.skills.tips} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Details;
