import { Wind, Droplets, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, Thermometer } from 'lucide-react';
import { useWeather } from '../hooks/useWeather';

function windDirLabel(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

function WeatherIcon({ code, size = 16 }) {
  const base = { size };
  if (code === 0)  return <Sun {...base} className="text-yellow-400" />;
  if (code <= 2)   return <Sun {...base} className="text-yellow-400/60" />;
  if (code === 3)  return <Cloud {...base} className="text-slate-400" />;
  if (code <= 48)  return <CloudFog {...base} className="text-slate-400" />;
  if (code <= 65)  return <CloudRain {...base} className="text-blue-400" />;
  if (code <= 75)  return <CloudSnow {...base} className="text-sky-300" />;
  if (code <= 82)  return <CloudRain {...base} className="text-blue-400" />;
  if (code >= 95)  return <CloudLightning {...base} className="text-yellow-300" />;
  return <Thermometer {...base} className="text-slate-400" />;
}

export default function WeatherWidget() {
  const { weather, loading } = useWeather();

  if (loading) {
    return (
      <div
        className="shimmer h-[64px] rounded-xl"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      />
    );
  }
  if (!weather) return null;

  return (
    <div
      className="rounded-xl p-3"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <WeatherIcon code={weather.code} size={17} />
          <div>
            <p className="text-[9px] text-slate-600 uppercase tracking-widest font-medium">Seattle, WA</p>
            <p className="text-[11px] text-slate-300">{weather.description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold text-white leading-none">{weather.temp}°F</p>
          <p className="text-[10px] text-slate-600 mt-0.5">Feels {weather.feelsLike}°</p>
        </div>
      </div>
      <div className="flex items-center gap-3 pt-2 border-t border-white/[0.05]">
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <Wind size={10} />
          <span>{weather.windSpeed} mph {windDirLabel(weather.windDir)}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <Droplets size={10} />
          <span>{weather.humidity}%</span>
        </div>
        {weather.precipitation > 0 && (
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <CloudRain size={10} />
            <span>{weather.precipitation}"</span>
          </div>
        )}
      </div>
    </div>
  );
}
