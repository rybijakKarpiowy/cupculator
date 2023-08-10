export interface ColorPricing {
  transfer_plus: Transferplus[];
  polylux: Transferplus[];
  direct_print: Directprint[];
  trend_color: Trendcolor[];
  pro_color: Trendcolor[];
  deep_effect: Deepeffect[];
  digital_print: Digitalprint;
  cardboard_print: Cardboardprint[];
  soft_touch: Trendcolor;
  deep_effect_plus: Deepeffect[];
  trend_color_lowered_edge: Trendcolor;
  additional_costs: Additionalcost[];
  cardboards: Cardboard[];
}

interface Cardboard {
  name: string;
  material: string;
  prices: Prices3;
}

interface Additionalcost {
  name: string;
  price: number;
}

interface Cardboardprint {
  colorCount: string;
  prepCost: number;
  nextOrderCost: number;
  prices: Prices3;
}

interface Digitalprint {
  prepCost: number;
  prices: Prices3;
}

interface Deepeffect {
  sidesCount: string;
  prepCost: number;
  prices: Prices3;
}

interface Trendcolor {
  inOut: string;
  prices: Prices3;
}

interface Prices3 {
  '24': number;
  '72': number;
  '108': number;
  '216': number;
  '504': number;
  '1008': number;
  '2520': number;
}

interface Directprint {
  colorCount: string;
  prepCost: number;
  nextOrderCost: number;
  prices: Prices2;
}

interface Prices2 {
  '216': number;
  '504': number;
  '1008': number;
  '2520': number;
  '72'?: number;
  '108'?: number;
}

interface Transferplus {
  colorCount: string;
  prepCost: number;
  nextOrderCost: number;
  prices: Prices;
}

interface Prices {
  '24': _24;
  '72': _24;
  '108': _24;
  '216': _24;
  '504': _24;
  '1008': _24;
  '2520': _24;
}

interface _24 {
  '1': number;
  '2': number;
  wallpaper: number;
}