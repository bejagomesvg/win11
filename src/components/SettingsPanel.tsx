import type { CSSProperties } from 'react';
import { Check } from 'lucide-react';
import { useDesktopStore } from '@/store/desktopStore';
import type { ColorTheme, DockPosition, ThemeMode } from '@/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

const themeOptions: ThemeMode[] = ['light', 'dark'];
const dockOptions: DockPosition[] = ['left', 'right', 'top', 'bottom'];
const colorThemeOptions: Array<{ value: ColorTheme; swatch: string; label: string }> = [
  { value: 'red', swatch: '#ef4444', label: 'Red' },
  { value: 'orange', swatch: '#f97316', label: 'Orange' },
  { value: 'yellow', swatch: '#eab308', label: 'Yellow' },
  { value: 'green', swatch: '#65a30d', label: 'Green' },
  { value: 'teal', swatch: '#14b8a6', label: 'Teal' },
  { value: 'mist', swatch: '#67e8f9', label: 'Mist' },
  { value: 'blue', swatch: '#3b82f6', label: 'Blue' },
  { value: 'purple', swatch: '#8b5cf6', label: 'Purple' },
  { value: 'fuchsia', swatch: '#d946ef', label: 'Fuchsia' },
  { value: 'pink', swatch: '#ec4899', label: 'Pink' },
];

function SettingSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="radius-panel border-border/70 bg-card/65 backdrop-blur-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="font-display text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

function SettingRow({
  title,
  description,
  control,
}: {
  title: string;
  description: string;
  control: React.ReactNode;
}) {
  return (
    <div className="radius-card flex items-center justify-between gap-4 border border-border/70 bg-background/50 px-4 py-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {control}
    </div>
  );
}

function SettingSlider({
  title,
  description,
  value,
  min,
  max,
  step,
  onValueChange,
}: {
  title: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number) => void;
}) {
  return (
    <div className="radius-card border border-border/70 bg-background/50 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        <span className="w-10 text-right text-sm font-semibold text-foreground">{value}</span>
      </div>
      <Slider
        className="mt-4"
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(values) => onValueChange(values[0] ?? value)}
      />
    </div>
  );
}

export function SettingsPanel() {
  const settings = useDesktopStore((state) => state.settings);
  const updateSettings = useDesktopStore((state) => state.updateSettings);

  return (
    <div className="space-y-6 pb-10">
      <SettingSection title="Themes">
        <div className="grid gap-3 md:grid-cols-2">
          {themeOptions.map((theme) => {
            const selected = theme === settings.theme;

            return (
              <button
                key={theme}
                type="button"
                onClick={() => void updateSettings({ theme })}
                className={cn(
                  'radius-card border p-3 text-left transition hover:-translate-y-0.5',
                  selected
                    ? 'border-primary/70 bg-primary/10 shadow-[0_0_0_1px_rgba(var(--color-primary),0.22)]'
                    : 'border-border/70 bg-background/50 hover:bg-accent/70',
                )}
              >
                <div
                  className={cn(
                    'radius-block relative h-24 overflow-hidden border border-white/10',
                    theme === 'light'
                      ? 'bg-[linear-gradient(180deg,#8ec5ff,#2f8fff)]'
                      : 'bg-[linear-gradient(180deg,#77bbff,#1b7df2)]',
                  )}
                >
                  <div
                    className={cn(
                      'radius-control absolute left-6 top-7 h-10 w-14 shadow-lg',
                      theme === 'light' ? 'bg-white' : 'bg-slate-900',
                    )}
                  />
                  <div className="radius-control absolute left-11 top-3 h-10 w-16 bg-black/45" />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm font-semibold capitalize text-foreground">{theme}</p>
                  {selected ? <Check className="h-4 w-4 text-primary" /> : null}
                </div>
              </button>
            );
          })}
        </div>

        <div className="radius-card border border-border/70 bg-background/50 px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Color</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {colorThemeOptions.map((option) => {
              const selected = settings.colorTheme === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-label={option.label}
                  title={option.label}
                  onClick={() => void updateSettings({ colorTheme: option.value })}
                  className={cn(
                    'relative flex h-8 w-8 items-center justify-center rounded-full transition hover:scale-105',
                    selected && 'shadow-[0_0_0_2px_var(--swatch-ring),0_0_8px_var(--swatch-ring)]',
                  )}
                  style={
                    selected
                      ? ({
                          ['--swatch-ring' as string]: option.swatch,
                        } as CSSProperties)
                      : undefined
                  }
                >
                  <span
                    className={cn('block h-5 w-5 rounded-full', selected && 'border border-white/80')}
                    style={{ backgroundColor: option.swatch }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <SettingSlider
          title="Interface corner radius"
          description="Controla o arredondamento geral dos componentes da interface."
          value={settings.interfaceRadius}
          min={2}
          max={25}
          step={2}
          onValueChange={(value) => void updateSettings({ interfaceRadius: value })}
        />
      </SettingSection>

      <SettingSection title="Dock">
        <SettingRow
          title="Auto-hide the Dock"
          description="A dock se esconde automaticamente quando nao esta em uso."
          control={
            <Switch
              checked={settings.autoHide}
              onCheckedChange={(checked) => void updateSettings({ autoHide: checked })}
            />
          }
        />

        <SettingRow
          title="Panel mode"
          description="A dock fica com visual mais encostado na borda da tela."
          control={
            <Switch
              checked={settings.panelMode}
              onCheckedChange={(checked) => void updateSettings({ panelMode: checked })}
            />
          }
        />

        <SettingSlider
          title="Icon size"
          description="Ajuste o tamanho dos icones da dock."
          value={settings.iconSize}
          min={24}
          max={56}
          step={2}
          onValueChange={(value) => void updateSettings({ iconSize: value })}
        />

        <SettingSlider
          title="Dock corner radius"
          description="Controle o quanto a dock fica arredondada."
          value={settings.dockRadius}
          min={0}
          max={40}
          step={2}
          onValueChange={(value) => void updateSettings({ dockRadius: value })}
        />

        <SettingSlider
          title="Dock transparency"
          description="Ajuste a transparencia do fundo da dock."
          value={settings.dockTransparency}
          min={35}
          max={100}
          step={5}
          onValueChange={(value) => void updateSettings({ dockTransparency: value })}
        />

        <SettingRow
          title="Position on screen"
          description="Escolha em qual borda a dock fica visivel."
          control={
            <Select
              value={settings.dockPosition}
              onValueChange={(value) => void updateSettings({ dockPosition: value as DockPosition })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {dockOptions.map((dockPosition) => (
                  <SelectItem key={dockPosition} value={dockPosition}>
                    {dockPosition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
      </SettingSection>
    </div>
  );
}
