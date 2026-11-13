"use client";

import { FieldRow } from "@/components/FieldRow";
import { Switch } from "@/components/Switch";
import { useSettingsForm } from "@/hooks/useSettingsForm";
import { SettingsFormFooter } from "@/settings/SettingsFormFooter";
import type { HandOffSettings } from "@/types/HandOffSettings";
import type { SettingsFormProps } from "@/types/SettingsFormProps";

const controlLook = "min-h-11 w-full max-w-sm rounded-control border border-line bg-paper px-3 text-sm disabled:bg-surface disabled:text-ink-muted";

export function HandOffSettingsForm({ initialValues }: SettingsFormProps<HandOffSettings>) {
  const { values, hasChanged, savingState, errorMessage, change, reset, save } = useSettingsForm(initialValues, "hand-off");

  return (
    <div className="flex flex-col">
      <FieldRow label="Hand-off sentence" detail="After the agent says why, it rings the team and says exactly this, then ends the call.">
        <textarea aria-label="Hand-off sentence" value={values.handOffSentence} onChange={(event) => change({ handOffSentence: event.target.value })} rows={2} maxLength={300} className={`${controlLook} py-2`} />
      </FieldRow>
      <FieldRow label="Email the team" detail="Send an email after every hand-off.">
        <Switch isOn={values.emailTeam} label="Email the team" onToggle={() => change({ emailTeam: !values.emailTeam })} />
      </FieldRow>
      <FieldRow label="Team email" detail="Where hand-off emails go. Only masked details are sent.">
        <input aria-label="Team email" type="email" value={values.teamEmail} onChange={(event) => change({ teamEmail: event.target.value.trim() })} disabled={!values.emailTeam} placeholder="support@example.com" className={controlLook} />
      </FieldRow>
      <SettingsFormFooter hasChanged={hasChanged} savingState={savingState} errorMessage={errorMessage} saveLabel="Save and update agent" onReset={reset} onSave={save} />
    </div>
  );
}
