# Riot Games API Compliance Checklist

## ✅ Compliance Status for Bracket Esports

### API Key Security
- [ ] **CRITICAL**: Move Riot API key to backend environment variables
- [ ] **CRITICAL**: Never expose API keys in frontend code
- [ ] **CRITICAL**: Use proper authentication for API requests
- [ ] Implement rate limiting to respect API limits

### Policy Compliance
- [x] **Purpose**: Enriching League of Legends community ✅
- [x] **Player Experience**: Positive tournament experience ✅
- [x] **Community Building**: Connecting players through competition ✅
- [ ] **No Ranking Alternatives**: Ensure tournament rankings don't mimic official systems
- [ ] **Player Evaluation**: Focus on positive metrics only
- [ ] **Monetization**: Review coin system compliance

### Design Guidelines
- [x] **Art Assets**: Using game art is allowed ✅
- [ ] **No Official Logos**: Remove any Riot/League/Valorant official logos
- [ ] **No Official Branding**: Ensure UI doesn't mimic official game design
- [ ] **No Partnership Claims**: Avoid implying Riot endorsement

### Technical Requirements
- [ ] **API Endpoints Only**: Use documented Riot API endpoints only
- [ ] **No Scraping**: Avoid undocumented endpoints
- [ ] **No Game Systems**: Don't connect to League chat or other systems
- [ ] **Production Key**: Apply for Production API key when ready

### Prohibited Features to Avoid
- ❌ MMR/ELO calculators
- ❌ Alternative ranking systems
- ❌ Player reporting/evaluation systems
- ❌ Player shaming features
- ❌ Unfair advantage tools

### Recommended Actions
1. **Immediate**: Secure Riot API key in backend
2. **Review**: Coin system monetization compliance
3. **Apply**: For Production API key when ready
4. **Remove**: Any official Riot branding/logos
5. **Document**: Clear non-affiliation disclaimer

### Questions for Riot (via Application)
- Is tournament entry fee system compliant?
- Are tournament rankings acceptable?
- Clarification on player evaluation features

## Next Steps
1. Implement API key security fixes
2. Review UI for official branding
3. Add compliance disclaimers
4. Prepare Production API application
