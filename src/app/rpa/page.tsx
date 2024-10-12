'use client';
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

export default function Rpa() {
  const { user, isLoading: authLoading } = useUser();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [formFields, setFormFields] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const options = ['Selecione uma automação', '1. Download PDF Católica', '2. Relatório FIPE'];

  useEffect(() => {
    if (!user && !authLoading) {
      alert("Você precisa estar logado para acessar essa página.");
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (selectedOption) {
      sessionStorage.setItem('selectedOption', selectedOption);
      sessionStorage.setItem('formFields', JSON.stringify(formFields));
      sessionStorage.setItem('message', message || '');
    }
  }, [selectedOption, formFields, message]);
  
  useEffect(() => {
    const savedLoading = sessionStorage.getItem('isLoading');
    console.log(savedLoading);
    if (savedLoading === 'true') {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }

    const savedOption = sessionStorage.getItem('selectedOption');
    const savedFields = sessionStorage.getItem('formFields');
    const savedMessage = sessionStorage.getItem('message');

    if (savedOption) {
      setSelectedOption(savedOption);
    }
    if (savedFields) {
      setFormFields(JSON.parse(savedFields));
    }
    if (savedMessage) {
      setMessage(savedMessage);
    }
  }, []);  

  if (authLoading) {
    return <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-20 pb-20 gap-16 sm:p-20 text-2xl font-[family-name:var(--font-geist-sans)]">Carregando...</div>;
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelection = (option: string) => {
    setSelectedOption(option);

    if (option === 'Selecione uma automação') {
      setFormFields({});
    } else if (option === '1. Download PDF Católica') {
      setFormFields({ user: '', password: '' });
    } else if (option === '2. Relatório FIPE') {
      setFormFields({ marca: '', modelo: '', mes: '' });
    }

    setIsOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormFields(prevFields => ({
      ...prevFields,
      [field]: value
    }));
  };

  const handleExecute = async () => {
    const emptyFields = Object.entries(formFields).filter(([_, value]) => !value);
  
    if (!selectedOption || selectedOption === 'Selecione uma automação') {
      setMessage('Aviso: Selecione uma automação válida.');
    } else if (emptyFields.length > 0) {
      setMessage('Aviso: Todos os campos devem ser preenchidos.');
    } else {
      setIsLoading(true);
      sessionStorage.setItem('isLoading', 'true');
      setMessage(`Executando automação: ${selectedOption}.`);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/executar`;
  
      const data = {
        opcao: selectedOption,
        user: formFields.user || '',
        password: formFields.password || '',
        marca: formFields.marca || '',
        modelo: formFields.modelo || '',
        mes: formFields.mes || '',
      };
  
      try {
        const responseMe = await fetch('/api/auth/me');
        const authData = await responseMe.json();
  
        if (!authData || !authData.token) {
          throw new Error('Erro ao obter o token de autenticação.');
        }
  
        const token = authData.token;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          const contentType = response.headers.get('Content-Type');
          if (contentType && contentType.includes('application/json')) {
            const err = await response.json();
            throw new Error(err.mensagem);
          } else {
            const errText = await response.text();
            throw new Error(errText);
          }
        }
  
        const contentType = response.headers.get('Content-Type');
        if (contentType === 'application/pdf') {
          const blob = await response.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `Fatura_${Date.now()}.pdf`;
          link.click();
          setMessage('Automação executada com sucesso.');
        } else {
          const data = await response.json();
          setMessage(data.mensagem);
        }
      } catch (error) {
        setMessage(`Erro ao executar a automação: ${error}`);
      } finally {
        setIsLoading(false);
        sessionStorage.setItem('isLoading', 'false');
        sessionStorage.clear();
      }
    }
  };

  setTimeout(() => {
    setMessage(null);
  }, 5000);

  if (user) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-20 pb-20 font-[family-name:var(--font-geist-mono)]">
        <div className="mt-4 flex flex-col gap-8 row-start-4 items-center justify-center sm:items-start" style={{ position: 'relative', display: 'inline-block', userSelect: 'none' }}>
          <div className="text-2xl"
               onClick={!isLoading ? toggleDropdown : undefined}
               style=
               {{
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  padding: '10px',
                  border: '1px solid',
                  borderRadius: '4px',
                  width: '500px',
                  textAlign: 'center',
                  opacity: isLoading ? 0.5 : 1
                }}>
            {selectedOption ? selectedOption : 'Selecione uma automação'}
            <span style={{ marginLeft: '16px' }}>
              {isOpen ? '▲' : '▼'}
            </span>
          </div>

          {isOpen && (
            <ul className="flex flex-col row-start-4 items-center justify-center sm:items-start text-1xl"
                style=
                {{
                  top: '100%',
                  left: '0',
                  marginTop: '4px',
                  padding: '0',
                  listStyle: 'none',
                  border: '1px solid',
                  borderRadius: '4px',
                  width: '100%'
                  }}>
                {options.map((option) => (
                <li
                  key={option}
                  onClick={() => handleSelection(option)}
                  style=
                  {{
                    padding: '6px',
                    cursor: 'pointer',
                    width: '100%',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                    transition: 'all 200ms ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--foreground)';
                    e.currentTarget.style.color = 'var(--background)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--background)';
                    e.currentTarget.style.color = 'var(--foreground)';
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}

          {selectedOption && selectedOption !== 'Selecione uma automação' && (
            <>
              <p
                className="row-start-5 p-8"
                style=
                {{
                  userSelect: 'none',
                  textAlign: 'center'
                }}
              >
                Insira os parâmetros da automação:
              </p>

              {selectedOption === '1. Download PDF Católica' && (
                <div className="flex flex-col grid row-start-6 items-center justify-center"
                     style=
                     {{
                        width: '100%'
                      }}>
                  <form className="flex flex-col grid row-start-6 items-center justify-center">
                    <input
                      type="text"
                      placeholder="Usuário Católica"
                      autoComplete="off"
                      className="input-field"
                      style=
                      {{
                        marginBottom: '10px',
                        padding: '8px',
                        width: '100%',
                        borderRadius: '4px',
                        backgroundColor: 'var(--background)',
                        color: 'var(--foreground)',
                        border: '2px solid var(--foreground)',
                        opacity: isLoading ? 0.5 : 1,
                        cursor: isLoading ? 'not-allowed' : 'auto'
                      }}
                      value={formFields.user || ''}
                      onChange={(e) => handleInputChange('user', e.target.value)}
                      disabled={isLoading}
                    />
                    <input
                      type="password"
                      placeholder="Senha Católica"
                      autoComplete="off"
                      className="input-field"
                      style=
                      {{
                        padding: '8px',
                        width: '100%',
                        borderRadius: '4px',
                        backgroundColor: 'var(--background)',
                        color: 'var(--foreground)',
                        border: '2px solid var(--foreground)',
                        opacity: isLoading ? 0.5 : 1,
                        cursor: isLoading ? 'not-allowed' : 'auto'
                      }}
                      value={formFields.password || ''}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      disabled={isLoading}
                    />
                  </form>

                </div>
              )}

              {selectedOption === '2. Relatório FIPE' && (
                <div className="flex flex-col grid row-start-6 items-center justify-center"
                      style=
                      {{
                        width: '100%'
                      }}>
                  <form className="flex flex-col grid row-start-6 items-center justify-center">
                    <input 
                      type="text"
                      placeholder="Marca Veículo"
                      autoComplete="off"
                      className="input-field"
                      style=
                      {{
                        marginBottom: '10px',
                        padding: '8px',
                        width: '100%',
                        borderRadius: '4px',
                        backgroundColor: 'var(--background)',
                        color: 'var(--foreground)',
                        border: '2px solid var(--foreground)',
                        opacity: isLoading ? 0.5 : 1,
                        cursor: isLoading ? 'not-allowed' : 'auto'
                      }}
                      value={formFields.marca || ''}
                      onChange={(e) => handleInputChange('marca', e.target.value)}
                      disabled={isLoading}
                    />
                    <input 
                      type="text"
                      placeholder="Modelo Veículo"
                      autoComplete="off"
                      className="input-field"
                      style=
                      {{
                        marginBottom: '10px',
                        padding: '8px',
                        width: '100%',
                        borderRadius: '4px',
                        backgroundColor: 'var(--background)',
                        color: 'var(--foreground)',
                        border: '2px solid var(--foreground)',
                        opacity: isLoading ? 0.5 : 1,
                        cursor: isLoading ? 'not-allowed' : 'auto'
                      }}
                      value={formFields.modelo || ''}
                      onChange={(e) => handleInputChange('modelo', e.target.value)}
                      disabled={isLoading}
                    />
                    <input 
                      type="text"
                      placeholder="Ano Veículo"
                      autoComplete="off"
                      className="input-field"
                      style=
                      {{
                        padding: '8px',
                        width: '100%',
                        borderRadius: '4px',
                        backgroundColor: 'var(--background)',
                        color: 'var(--foreground)',
                        border: '2px solid var(--foreground)',
                        opacity: isLoading ? 0.5 : 1,
                        cursor: isLoading ? 'not-allowed' : 'auto'
                      }}
                      value={formFields.mes || ''}
                      onChange={(e) => handleInputChange('mes', e.target.value)}
                      disabled={isLoading}
                    />
                  </form>
                </div>
              )}
            </>
          )}
        </div>
        
        {selectedOption && selectedOption !== 'Selecione uma automação' && (
          <button
            className="row-start-7"
            onClick={handleExecute}
            style=
            {{
                marginTop: '30px',
                padding: '10px 20px',
                backgroundColor: 'var(--foreground)',
                color: 'var(--background)',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                userSelect: 'none',
                opacity: isLoading ? 0.5 : 1
            }}
            disabled={isLoading}
          >
            Executar
          </button>
        )}

        {isLoading && (
          <div className="loading-spinner row-start-8 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ margin: "auto", display: "block" }}
              width="50px"
              height="50px"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid"
            >
              <circle
                cx="50"
                cy="50"
                r="32"
                strokeWidth="8"
                stroke="var(--foreground)"
                strokeDasharray="50.26548245743669 50.26548245743669"
                fill="none"
                strokeLinecap="round"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  repeatCount="indefinite"
                  dur="1s"
                  keyTimes="0;1"
                  values="0 50 50;360 50 50"
                ></animateTransform>
              </circle>
            </svg>
          </div>
        )}

        {message && (
          <div
          className="row-start-9"
          style=
          {{
              marginTop: '20px',
              padding: '10px',
              backgroundColor: message.toLowerCase().startsWith('erro') ? 'red' : message.toLowerCase().startsWith('aviso') ? 'yellow' : 'green',
              color: 'black',
              borderRadius: '4px',
              textAlign: 'center',
              border: '2px solid var(--foreground)'
            }}
          >
            {message}
          </div>
        )}
      </div>
    );
  }

  return null;
}
