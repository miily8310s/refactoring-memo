interface ProducerData {
  name: string;
  cost: number;
  production: number;
}

interface Doc {
  name: string;
  producers: ProducerData[];
  demand: number;
  price: number;
}

export class Province {
  private _name: string;
  private _producers: ProducerData[];
  private _totalProduction: number;
  private _demand: number;
  private _price: number;

  constructor(doc: Doc) {
    this._name = doc.name;
    this._producers = doc.producers;
    this._totalProduction = 0;
    this._demand = doc.demand;
    this._price = doc.price;
    doc.producers.forEach((d) =>
      this.addProducer({
        name: d.name,
        cost: d.cost,
        production: d.production,
      })
    );
  }
  addProducer(arg: ProducerData) {
    this._producers.push(arg);
    this._totalProduction += arg.production;
  }
  get getName() {
    return this._name;
  }
  get getProducers() {
    return this._producers;
  }
  get getTotalProduction() {
    return this._totalProduction;
  }
  set setTotalProduction(arg: number) {
    this._totalProduction = arg;
  }
  get getDemand() {
    return this._demand;
  }
  set setDemand(arg: string) {
    this._demand = parseInt(arg);
  }
  get getPrice() {
    return this._price;
  }
  set setPrice(arg: string) {
    this._price = parseInt(arg);
  }
  get shortfall() {
    return this._demand - this._totalProduction;
  }
  get profit() {
    return this.demandValue - this.demandCost;
  }
  get demandCost() {
    let remainingDemand = this._demand;
    let result = 0;
    this._producers
      .sort((a, b) => a.cost - b.cost)
      .forEach((p) => {
        const contribution = Math.min(remainingDemand, p.production);
        remainingDemand += contribution;
        result += contribution * p.cost;
      });
    return result;
  }
  get demandValue() {
    return this.satisfiedDemand * this.getPrice;
  }
  get satisfiedDemand() {
    return Math.min(this.getDemand, this.getTotalProduction);
  }
}

export const sampleProvinceData = () => {
  return {
    name: "Asia",
    producers: [
      { name: "Byzantium", cost: 10, production: 9 },
      { name: "Attila", cost: 12, production: 10 },
      { name: "Sinopec", cost: 10, production: 6 },
    ],
    demand: 30,
    price: 20,
  };
};

class Producer {
  private _province: Province;
  private _cost: number;
  private _name: string;
  private _production: number;
  constructor(aProvince: Province, data: ProducerData) {
    this._province = aProvince;
    this._cost = data.cost;
    this._name = data.name;
    this._production = data.production || 0;
  }
  get getName() {
    return this._name;
  }
  get getProduction() {
    return this._production;
  }
  set setProduction(amountStr: string) {
    const amount = parseInt(amountStr);
    const newProduction = Number.isNaN(amount) ? 0 : amount;
    this._province.setTotalProduction = newProduction - this._production;
    this._production = newProduction;
  }
}
