
import React from 'react';
import type { RefundResponse, NormalizedFields, Claim, ExecutionStep } from '../types';
import { ClipboardIcon, DocumentIcon, ScaleIcon, RoadmapIcon, LetterIcon, WarningIcon } from './Icons';

interface ResultsDisplayProps {
  result: RefundResponse;
}

const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="py-2">
    <dt className="text-sm font-medium text-slate-400">{label}</dt>
    <dd className="mt-1 text-sm text-white">{value}</dd>
  </div>
);

const Card: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-lg shadow-md overflow-hidden mb-6">
    <div className="p-5 bg-slate-800 border-b border-slate-700">
      <h3 className="flex items-center text-lg font-semibold leading-6 text-white">
        {icon}
        <span className="ml-3">{title}</span>
      </h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const NormalizedFieldsCard: React.FC<{ fields: NormalizedFields }> = ({ fields }) => (
  <Card title="Normalized Fields" icon={<DocumentIcon className="w-6 h-6 text-sky-400" />}>
    <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
      <InfoItem label="Booking ID" value={fields.booking_id} />
      <InfoItem label="Platform" value={fields.platform} />
      <InfoItem label="Party" value={`${fields.party.name} (${fields.party.role})`} />
      <InfoItem label="Origin" value={fields.itinerary.origin} />
      <InfoItem label="Destination" value={fields.itinerary.destination} />
      <InfoItem label="Carrier/Hotel" value={fields.itinerary.carrier_or_hotel} />
      <InfoItem label="Charged Amount" value={`${fields.amounts.charged} ${fields.amounts.currency}`} />
      <InfoItem label="Booking Time" value={new Date(fields.timelines.booking_time).toLocaleString()} />
      <InfoItem label="Event Time" value={new Date(fields.timelines.event_time).toLocaleString()} />
    </dl>
  </Card>
);

const ClaimsCard: React.FC<{ claims: Claim[] }> = ({ claims }) => (
  <Card title="Legal Claims" icon={<ScaleIcon className="w-6 h-6 text-sky-400" />}>
    <ul className="space-y-4">
      {claims.map((claim, index) => (
        <li key={index} className="p-4 bg-slate-900/50 rounded-md border border-slate-600">
          <p className="font-semibold text-white">{claim.statement}</p>
          {claim.support.map((sup, sIndex) => (
            <blockquote key={sIndex} className="mt-2 pl-3 border-l-2 border-slate-500 text-slate-400 italic">
              "{sup.quote}"
              <cite className="block not-italic text-xs text-right mt-1 text-sky-400">
                Source: {sup.source} ({sup.id_or_ref})
              </cite>
            </blockquote>
          ))}
        </li>
      ))}
    </ul>
  </Card>
);

const ExecutionStepsCard: React.FC<{ steps: ExecutionStep[] }> = ({ steps }) => (
  <Card title="Recovery Path" icon={<RoadmapIcon className="w-6 h-6 text-sky-400" />}>
    <ol className="relative border-l border-slate-600 ml-2">
      {steps.map((step) => (
        <li key={step.step} className="mb-8 ml-6">
          <span className="absolute flex items-center justify-center w-6 h-6 bg-sky-900 rounded-full -left-3 ring-8 ring-slate-800">
            <span className="text-sky-400 font-bold text-xs">{step.step}</span>
          </span>
          <h4 className="flex items-center mb-1 text-md font-semibold text-white">{step.action}</h4>
          <time className="block mb-2 text-sm font-normal leading-none text-slate-500">SLA: {step.sla_hours} hours</time>
          <p className="text-base font-normal text-slate-300">{step.success_criteria}</p>
        </li>
      ))}
    </ol>
  </Card>
);

const AppealDraftCard: React.FC<{ draft: string }> = ({ draft }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(draft);
  };
  return (
    <Card title="Appeal Draft" icon={<LetterIcon className="w-6 h-6 text-sky-400" />}>
       <div className="relative">
        <button onClick={copyToClipboard} className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 transition">
          <ClipboardIcon className="w-5 h-5"/>
        </button>
        <pre className="whitespace-pre-wrap bg-slate-900/50 p-4 rounded-md font-serif text-slate-300 text-sm border border-slate-600">{draft}</pre>
      </div>
    </Card>
  );
};


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  if (result.status === 'error') {
    return (
      <Card title="Analysis Failed" icon={<WarningIcon className="w-6 h-6 text-yellow-400" />}>
        <p className="text-yellow-300 mb-2">{result.reason}</p>
        {result.data.requested_fields && result.data.requested_fields.length > 0 && (
          <div>
            <p className="font-semibold text-white">The following information could not be found:</p>
            <ul className="list-disc list-inside mt-2 text-slate-300">
              {result.data.requested_fields.map((field, i) => <li key={i}>{field}</li>)}
            </ul>
          </div>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <NormalizedFieldsCard fields={result.data.normalized_fields} />
      <ClaimsCard claims={result.data.claims} />
      <ExecutionStepsCard steps={result.data.execution_steps} />
      <AppealDraftCard draft={result.data.appeal_draft} />
    </div>
  );
};

export default ResultsDisplay;
