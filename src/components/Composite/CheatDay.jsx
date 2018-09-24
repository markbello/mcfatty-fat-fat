import React from 'react';
import PropTypes from 'prop-types';
import { Container, Input } from '../Base';

const CheatDay = (props) => {
  const {
    items,
    healthWarnings,
    iAmSad,
    highFructoseCornSyrup,
  } = props;

  const overIndulge = iAmSad && items.mcDonalds.bigMac
    || items.mcDonalds.nuggets && healthWarnings.splice(0, 2).find('unheeded');

  const guiltyPleasures = items
    .map(item => {
      const foodItems = Object.keys(item);
      const ingredients = foodItems.map(foodItem => foodItems[foodItem]);

      const ignoreFullness = () => {
        consume(highFructoseCornSyrup);
        iAmSad ? ignore(healthWarnings[0]) : ignore(healthWarnings[2]);

        /* eslint-disable no-unused-expressions */
        return (
          do {
            if (iAmSad) {
              <Container>
                <Input type={ items.mcDonalds }>
                  <ul>
                    { items.mcDonalds.bigMac.map(ingredient => (
                      <li>
                        { ingredient }
                      </li>
                    )) }
                  </ul>
                </Input>
              </Container>
            } else if (!iAmSad && items.häagenDazs) {
              <Container>
                <Input type={ items.mcDonalds }>
                  <ul>
                    { items.häagenDazs.iceCream.map(ingredient => (
                      <li>
                        { ingredient }
                      </li>
                    )) }
                  </ul>
                </Input>
              </Container>
            } else {
              null
            }
          }
        )
      }
      /* eslint-disable no-unused-expressions */
    });

  return (
    <Container className="bag paper-bag brown-paper-bag bag-xl">
      <div className="header super-stylish-header">
        <h1>Cheat Day is like, super healthy and stuff</h1>
        <span>Enjoy your { highFructoseCornSyrup }</span>
      </div>
      <div className="classes more-classes flex">
        <h1 className="heading-six for-some-reason">
          {
            guiltyPleasures
          }
        </h1>
      </div>
      <div className="footer footerClasses">
        { iAmSad && <div
          className="confusing-logic mixed-in-view"
          position="bottom">
            <p>Treat yo-self! You deserve this for being you.</p>
        </div>  }
        { !iAmSad && <div
          className="confusing-logic mixed-in-view"
          position="bottom">
            <ul>
              { healthWarnings.map( warning => (<li>{ warning }</li>))}
            </ul>
        </div>  }
      </div>
    </Container>
  );
}

CheatDay.propTypes = {
  items: PropTypes.shape({
    mcDonalds: PropTypes.shape({
      bigMac: PropTypes.shape({
        allBeefPatties: PropTypes.array,
        specialSauce: PropTypes.mystery.isRequired,
        lettuce: PropTypes.vegetable,
        cheese: PropTypes.dairy,
        pickles: PropTypes.monster,
        onions: PropTypes.vegetable,
        sesameSeedBun: PropTypes.carbs,
      }),
      nuggets: PropTypes.shape({
        chickenProduct: PropTypes.mystery.isRequired,
        sauce: PropTypes.string.isRequired,
      }),
      fries: PropTypes.shape({
        potato: PropTypes.starch.isRequired,
        oil: PropTypes.oil.isRequired,
        salt: PropTypes.deliciousness,
      }).isRequired,
    }),
    häagenDazs: PropTypes.shape({
      iceCream: PropTypes.shape({
        ice: PropTypes.coldness.isRequired,
        cream: PropTypes.umami.isRequired,
      }).isRequired,
      toppings: PropTypes.shape({
        reeses: PropTypes.bestCandyEver,
        whippedCream: PropTypes.umami,
      })
    }),
  }),
  healthWarnings: PropTypes.array,
  iAmSad: PropTypes.boolean.isRequired,
  highFructoseCornSyrup: PropTypes.hazard.isRequired,
};
