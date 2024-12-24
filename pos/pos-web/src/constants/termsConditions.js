const tNc = [
  {
    value:
      "The second party will use the above mentioned flat for accommodation only, on the condition that it is rented.",
  },
  {
    value:
      "The tenant will kindly submit a photocopy of his / her national identity card and a passport size photograph to the landlord.",
  },
  {
    value:
      "The flat has been rented to the tenant Mr. / Mrs. (Name of Tenant) for 02 (two) years, which will be effective from (Date).",
  },
  {
    value:
      "House rent per month Taka. (In Amount) (In word) is fixed. Both parties will be able to reschedule the rent after 02 (two) years subject to negotiation.",
  },
  {
    value: "Both parties can cancel the house rental agreement by giving 02 (two) months’ notice.",
  },
  {
    value: `Common bills of building like- Electric bill, water bill, gas bill, Care taker / security guard's monthly salary / bonus, generator fuel cost, 
        regular maintenance cost of building etc. must be paid as service charge at fixed rate/portion by the Tenants. The service charge has 
        to be paid by the 10th of every month.`,
  },
  {
    value: `The Tenant Mr. / Mrs. (Name of the Tenant) will pay his used electricity bill, water bill, gas bill and other bills in person and will return 
        the voucher or receipt of bill payment to the landlord (If Applicable). `,
  },
  {
    value: `The advance or security deposit Taka. (In Amount) (In word) paid by the tenant will be deposited with the landlord. At the time of 
        leaving the house, the first party (Owner) will be obliged to return the advance or security deposit money to the second party 
        (Tenant) or adjust the amount as a house rent. `,
  },
  {
    value: `The house rent has to be paid by 07th (Seventh) days of each month. Otherwise, if tenant is unable to pay the rent by twice after that 
        date, tenant will be bound to leave the house within that month. `,
  },
  {
    value: `Generator and lift service may be disrupted due to technical faults / servicing of generators and other problems.`,
  },
  {
    value: `The tenant will not be able to give any sublet in that flat / house. `,
  },
  {
    value: `The tenant will not be able to use the flat / house for any hotel or recreational purpose.`,
  },
  {
    value: `The tenant will always keep the surrounding area clean, including tenant stairs. `,
  },
  {
    value: `The tenant has to abide by the prevailing policies and social norms of the housing society. `,
  },
  {
    value: `If the electrical, plumbing and other fittings of the flat / house are damaged, it should be done by the tenant on his own initiative 
        and at his own expense by a first party hired repairman. However, no structural changes can be made.`,
  },

  {
    value: `The tenant has to ensure the security of flat/house at his/her own. `,
  },
  {
    value: `Nothing can be done that causes annoyance to the neighbor. `,
  },
  {
    value: `Noise pollution cannot be caused by using any machine or instrument that disturbs the peace of the neighbor. `,
  },
  {
    value: `Any kind of damage of the flat / house should be repair by the tenant on his own initiative and at his own expense by a first party 
        hired repairman. `,
  },

  {
    value: `Access will be reserved for inspection of rented flat / house by the owner of the flat / house or his nominee. `,
  },
  {
    value: `When the second party leaves the flat / house after the expiration date, second party will hand over the flat / house to the first party. `,
  },
  {
    value: `All types of furniture that will be installed by the second party can be taken away subject to the permission of the first party at the 
        end of the contract. `,
  },
  {
    value: `All types of furniture installed by the first party must be properly maintained and returned to the condition in which they were 
        rented before leaving the flat / house.`,
  },
  {
    value: `The first party will allocate 01 (one) parking space in the basement to the second party. `,
  },
  {
    value: `The contract may be renewed subject to the other party conduct, and timely payment of rent and other bills.`,
  },
];

export const TERMS_AND_CONDITIONS = tNc.map((val, key) => {
  return {
    key: key + 1,
    value: val.value,
  };
});
